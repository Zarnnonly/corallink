# CoralLink 

CoralLink is an end-to-end transparent coral reef restoration investment and funding platform built with **React 19** and **Vite**. The platform bridges marine conservation initiatives with global investors, corporations (ESG/CSR), and philanthropists, utilizing AI-assisted coral health analysis and verifiable restoration tracking.

---

## Current Development Progress & Features

The platform has evolved from an initial prototype into a fully integrated, feature-rich web application with complete investor and administrator workflows:

### 1. Public Discovery & Awareness
- **Landing Page (`Home`)**: Interactive hero with call-to-actions, company background (*About Us*), transparent impact metrics (*125,000+ fragments, IDR 10.2B+ disbursed*), core *Vision & Mission*, highlighted restoration projects, and an interactive *FAQ* accordion.
- **Project Catalogue (`TakeAction`)**: Comprehensive directory of active coral reef restoration initiatives with status tags and location metadata.
- **Smooth Anchor Navigation & Page Transitions**: Fluid scrolling between sections and transitions across routes.

### 2. Project Intelligence & AI Analysis
- **Project Detail & Milestones (`InvestPage`)**: Deep-dive overview displaying targeted species, restoration area, fragment count, project duration, dynamic funding progress, and multi-phase milestone timeline (*Site Assessment, Nursery Cultivation, Reef Transplantation, Monitoring*).
- **AI Health Analysis Report (`ProjectDetail`)**: Informational breakdown showing detected coral condition (*Healthy, At Risk, Unhealthy/Bleached*), AI confidence score, physical characteristics, supporting ecological factors, and intervention recommendations.

### 3. Investment & Contribution Flow (Investor Protected Route)
- **Investment Setup (`FormInvestment`)**: Choose contribution model (*One-Time* or *Monthly*), select preset amount tiers (*Rp 500.000 – Rp 10.000.000*) or custom amounts, and input investor details.
- **Payment & Proof Confirmation (`ConfirmInvestment`)**: Displays transaction summary with dynamic payment options (official QRIS code with full-size modal preview, or direct bank transfer details), transfer receipt image upload (JPG, PNG, WEBP up to 5MB), and real-time transaction submission.

### 4. Investor Portfolio & Profile (`UserProfile`)
- **Profile Photo Management**: User avatar upload with persistent server storage, client-side validation, and instant preview.
- **Investment History Tracking**: Responsive table detailing past contributions, investment type, date, amount, and real-time verification status (*AwaitingProof, Pending, Completed, Failed* with administrator review notes and proof re-submission capability).

### 5. Administrator Management Suite (`admin` Role)
- **AI-Assisted Project Publishing (`UploadProject`)**: Two-step creation wizard. Step 1 runs client-side image verification via the AI model (`/predict`) to validate damaged/bleached coral. Step 2 unlocks project metadata input (species, location, description, funding targets, fragment targets).
- **Milestone & Progress Tracking (`UpdateProject`)**: Update phase statuses (*Not Started, In Progress, Complete*) and publish detailed field progress notes with concurrency conflict protection.
- **Project Lifecycle & Safe Deletion (`DeleteProject`)**: Searchable project management directory with name-confirmation safety dialog; prevents deletion of projects with existing transactions to protect historical records.
- **Payment Verification Review (`AdminPayments`)**: Manage official receiving bank account details and inspect submitted transaction payment proofs with full image viewing, bank reconciliation confirmation, and approval (*Completed*) or rejection (*Failed* with required feedback).

### 6. Authentication & Security
- **Role-Based Access Control (RBAC)**: Distinguishes between public visitors, verified investors (`user`), and platform managers (`admin`).
- **Session Management**: Persistent JWT authentication, automatic session recovery on refresh, multi-tab synchronization, and auto-logout on token expiration.

---

## Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework & Core** | React 19, Vite 8 | Ultra-fast build and reactive rendering |
| **Routing** | React Router DOM v7 | Client-side routing with role-based route guards |
| **Icons & Visuals** | Lucide React | Clean, modern vector icon set |
| **Styling** | Vanilla CSS | Custom design tokens, glassmorphism, responsive across 320px–1440px+ |
| **Monitoring** | Vercel Analytics & Speed Insights | Real-time user performance and vital tracking |
| **Testing & Quality** | Node.js Test Runner, Oxlint | High-speed linting and automated API contract testing |

---

## API & Integration Architecture

- **Backend REST API**: Connected to `https://api.corallink.web.id` for authentication, catalog persistence, transactions, and payment administration.
- **AI Computer Vision API**: Integrated with the deep learning model at `/predict` to evaluate coral condition and bleaching severity.
- **File & Media Handling**: Multi-part upload support for project covers, investment receipts, and avatar images.

---

## Project Directory Structure

```text
corallink-app/
├── index.html                   # HTML entry point with SEO metadata
├── src/
│   ├── assets/                  # High-resolution WebP banners and icons
│   ├── components/              # Modular UI components (Navbar, Hero, About, Impact, etc.)
│   ├── context/                 # React Contexts (AuthContext, ProjectContext, ToastContext)
│   ├── lib/                     # API client wrapper, scroll reveal helpers
│   ├── pages/                   # Application route views (Home, Invest, Profile, Admin, etc.)
│   ├── App.jsx                  # Main routing configuration & provider tree
│   ├── main.jsx                 # Application bootstrapping
│   └── index.css                # Global design system variables & utility styles
├── tests/                       # Automated API integration and contract tests
└── package.json                 # Project dependencies and script definitions
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository and enter the directory
cd corallink-app

# Install project dependencies
npm install
```

### Available Scripts
```bash
# Start development server
npm run dev

# Run unit tests
npm test

# Run linter
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
