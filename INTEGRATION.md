# Backend integration

The frontend now uses the existing Express API at `VITE_API_URL=https://api.corallink.web.id`. `.env.production` contains this public build setting; Vercel dashboard values override it and require a new build. Never put database credentials or JWT signing secrets in Vite variables.

## UI to API mapping

| UI | Existing API | Behavior |
| --- | --- | --- |
| Register | POST /api/auth/register | Sends nama/email/password; backend determines investor role. Phone input removed because it cannot be saved. |
| Sign in | POST /api/auth/login | Sends email/password and stores returned bearer token. |
| Session/profile | GET /api/auth/profile | Validates persisted token before protected content; maps nama to name and investor to UI user role. No /auth/me dependency. |
| Logout/401 | Local session removal | Clears bearer token and in-memory user; expired sessions require sign-in. No server token revocation endpoint exists. |
| Home/catalog | GET /api/projects | API data only, loading/error/retry/empty states. Existing mock project file is retained but unused. |
| Project/detail | GET /api/projects | Finds numeric ID in the loaded list; no unsupported detail endpoint. Missing funding, milestones, species and analysis fields are shown as unavailable. Old mock slugs do not map to backend IDs. |
| Profile history | GET /api/donations/saya | Investor-specific donation records, explicitly payment unverified. Admin can view profile without calling investor-only history. |
| Payment/proof | Not available | Both direct payment routes show an unavailable notice; no fake QR code, local transaction or success confirmation. POST /api/donations is intentionally not presented as a payment flow. |
| Admin project publishing | Partial backend support | Full cover/metadata upload remains disabled. Existing POST /api/projects receives server-side admin guard and validation in the backend patch. |
| Milestones | Not available | Editing/submission disabled. |
| AI analysis | POST /predict | Multipart image, actual predicted_class and percentage confidence; HTTP and malformed response errors rejected. Analysis is informational, never authorization or funding approval. |

No schema migration or infrastructure/CORS changes are needed. Impact figures remaining in the marketing section are explicitly labeled illustrative, not verified platform metrics.

## Backend changes

Actual source was inspected in `/root/corallink-api` and compared with `/opt/corallink-api`, not assumed to match GitHub. Only `src/routes/project.routes.js` and `src/controllers/project.controller.js` were copied into runtime for this integration. Existing CORS, loopback bind, dependency updates and async error handling were preserved. The service was restarted successfully. A targeted backup is in `/root/corallink-deploy/frontend-integration-backup`.

- POST /api/projects now requires `admin` after JWT authentication.
- Project names/locations are validated; optional damage/restoration strings retain the existing contract. Caller-supplied admin IDs and AI approval fields are not trusted.
- Backend regression test: `node --test test/project-access.test.js` (in backend checkout).
- Backend changes have not been pushed: the connected GitHub account has read-only access to MustikaJr/corallink-api.

## Verification and deployment status

Frontend checks: `npm run build`, `npm run lint`, `node --test tests/api.test.js`.

Browser testing uses local build assets intercepted at the production frontend origin, with real HTTPS requests to the running API. This avoids changing the production CORS allowlist. It does **not** mean the frontend build has been deployed to Vercel. Localhost requests correctly show a connection error under the existing production-only CORS policy.

Vercel connector returned no accessible teams; project inspection requires a team ID. No dashboard environment settings or Vercel deployments have been changed by this integration. Once deployed, recheck the actual production frontend login/session/catalog/AI paths. Preview domains also need a deliberate backend CORS policy if they must call the live API.

Remaining backend capabilities: payment processing/verification, cover and proof storage, complete project metadata, milestones, and optional dedicated detail endpoint. These are not simulated by the UI.

## ML recovery during verification

The VPS restarted during the session. Express resumed automatically, but ML had no persistent service and port 5000 was empty; `/predict` returned 502. The existing unmodified `/root/CoralLink/app.py` was restarted with a transient systemd unit `corallink-ml-recovery`. `/health` recovered. This unit is temporary and does not establish boot persistence; a permanent ML service remains operational follow-up. Nginx/model/endpoint configuration was not changed.

The reviewable backend change is included in `backend-patches/admin-projects.patch`; it is already applied to the VPS runtime, but still needs to be incorporated into the backend GitHub repository by an account with write access.
