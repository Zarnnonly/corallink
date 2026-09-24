# CoralLink — Backend Requirements Specification

This document is prepared as a technical guide for Backend Developers. The CoralLink frontend currently operates using a mock or hybrid API integration designed to mirror RESTful API structures.

The backend developer's task is to provide a persistent database and RESTful API endpoints matching these requirements.

---

## 1. Architecture & Authentication (RBAC)

The application uses **Role-Based Access Control (RBAC)** with two primary roles:
1. `user` (Investor): Can view projects, invest, and view profile history.
2. `admin`: Can use AI features to upload new projects, review payments, and update project milestones.

**Authentication Requirements:**
* Uses **JSON Web Tokens (JWT)**.
* API endpoints must be protected with token verification and role-check middleware.

---

## 2. Database Schema (Recommended)

Below is the recommended structure for MongoDB collections or PostgreSQL/MySQL tables based on frontend state models:

### A. Table / Collection `Users`
| Field | Data Type | Description |
|---|---|---|
| `id` | UUID/ObjectId | Primary Key |
| `name` | String | Full name |
| `email` | String | Unique |
| `password_hash` | String | Bcrypt hash |
| `phone` | String | Optional |
| `role` | Enum | `['user', 'admin']` (Default: `user`) |
| `created_at` | Timestamp | - |

### B. Table / Collection `Projects`
*Stores the restoration project catalogue.*
| Field | Data Type | Description |
|---|---|---|
| `id` | String | Unique slug (e.g., `acropora-cervicornis`) or integer/UUID |
| `name` | String | Project Title |
| `subtitle` | String | Subtitle |
| `description` | Text | Detailed project description |
| `location` | String | Marine / coastal location |
| `species` | String | Coral species |
| `image_url` | String | Image link (Cloudinary/S3/local storage) |
| `goal` | Object / JSON | `{ fragments: String, area: String, duration: String }` |
| `fundingTarget` | String/Number | Funding target (in IDR) |
| `fundingPercent` | Number | Collected percentage (0-100) |
| `milestones` | Array of JSON | List of milestones (Phase 1, 2, etc.). Each has a `done` (boolean) or status property. |
| `ai_analysis` | Object / JSON | Stores detection results: `{ condition: String, confidenceScore: String, analysisStatus: String }` |

### C. Table / Collection `Transactions`
*Stores user investment history.*
| Field | Data Type | Description |
|---|---|---|
| `id` | UUID/ObjectId | Primary Key |
| `user_id` | UUID/ObjectId | Foreign Key to `Users` |
| `project_id` | String | Foreign Key to `Projects` |
| `amount` | Number/String | Investment amount |
| `type` | String | E.g.: `"One-Time Contribution"` |
| `status` | Enum | `['Pending', 'Completed', 'Failed']` |
| `proof_url` | String | Transfer proof image URL |
| `created_at` | Timestamp | Transaction date |

---

## 3. Required REST API Endpoints

Below is the list of endpoints used by the frontend.

### Authentication
* `POST /api/auth/register` : Accepts `name, email, password, phone`. Returns a JWT token and user info.
* `POST /api/auth/login` : Accepts `email, password`. Returns a JWT token and user data (including `role`).
* `GET /api/auth/me` or `/api/auth/profile`: Validates JWT token and returns current active user profile.

### Project Management (Projects)
* `GET /api/projects` : **(Public)** Retrieves all projects (for Home and Take Action catalogue).
* `GET /api/projects/:id` : **(Public)** Retrieves a single project by ID or slug.
* `POST /api/projects` : **(Admin Only)** Accepts multipart/form-data payload with new project cover image and fields.
* `PUT /api/projects/:id/milestones` : **(Admin Only)** Updates milestone array status and progress notes.

### Investment & Transactions
* `POST /api/transactions` : **(User Only)** Creates an investment transaction request.
* `GET /api/transactions/me` : **(User Only)** Retrieves investment history for the authenticated user.
* `GET /api/transactions` : **(Admin Only)** For admin payment review dashboard.
* `PUT /api/transactions/:id/status` : **(Admin Only)** Approves or rejects payment proof.

---

## 4. Third-Party Service Integrations

1. **AI Model API**
   * When uploading projects, the frontend connects to the AI endpoint `https://api.corallink.web.id/predict` to evaluate coral condition.
   * **Note for Backend:** Backend independently re-verifies images on upload to maintain integrity.
2. **File Storage**
   * Handles multipart/form-data for:
     1. User payment proof uploads.
     2. Admin project cover images.
     3. User profile avatar photos.