# CoralLink frontend integration

The original frontend before integration (commit 405c7a9) is the layout and interaction reference. Investment, payment confirmation, milestone editing and upload-success layouts have been restored. CSS and visual assets are unchanged. Existing mock project data remains in the repository but is not used as production data.

## Supported flows

- Register/login/profile/logout and restored optional phone field; name maps compatibly to backend nama. Investor role maps to the existing user UI role. Session restoration waits for the server and handles 401.
- Project publication retains the image -> AI analysis -> project details -> success workflow. Full description, species, funding target, fragments, area and duration persist with a real cover. Backend repeats ML analysis independently and requires Bleached for image-based restoration submissions; the client cannot approve its own image.
- Catalog/details load saved projects. Funding progress counts only administrator-verified Completed payments. Original project/AI sections display saved backend data.
- Milestone status and progress notes persist. Concurrent edits return a conflict instead of silently overwriting a newer version.
- Investment retains amount buttons, monthly/once choices, investor details and the two-column layout. Monthly means a manually repeated contribution, not automatic debit.
- Confirmation retains the summary, payment area, proof selection and support button. The fake QR image is replaced by the official bank information configured by admin. A transaction ID in the URL restores the request after refresh. Uploaded proof is Pending until reviewed.
- Profile shows real transaction statuses alongside clearly marked legacy donation records. A failed proof can be resubmitted.
- Admin Payment Review configures the official bank account and reviews private proofs. Approval requires checking the bank statement. Only approved amounts count as funding.

No real bank account was supplied or seeded. An administrator must enter the official account under Account menu -> Payment Review before transfer instructions can be enabled. All test account numbers belong only to isolated test databases.

## API and storage

Public frontend config remains `VITE_API_URL=https://api.corallink.web.id` in `.env.production`. It is not a secret. Vite reads it during build; Vercel Config values override the file. JWT signing and database secrets stay on the VPS.

Backend additions preserve existing endpoints and fields: project metadata, GET /api/projects/:id, milestone PUT, /api/transactions and owner/admin proof routes, /api/payments/settings, phone and /api/auth/me. Public images are re-encoded WebP under /uploads/covers. Proof images are on persistent VPS disk and accessible only through authenticated routes. No cloud-storage provider is required for this deployment.

Project and payment persistence uses additive Prisma migrations. Database backup precedes migration. The backend GitHub repository is still read-only to the connected account; `backend-patches/backend-sync.patch` captures the complete unpublished backend source changes (including prior deployment fixes) relative to its GitHub baseline. Do not blindly pull/reset the VPS checkout.

## Validation and deployment

`npm run build`, `npm test`, `npm run lint`; lint has React warnings. Backend isolated tests verify migrations, server role enforcement, image validation, milestone concurrency, private proof authorization, idempotent transaction creation, and funding only after approval.

Browser checks use the local production build and an isolated real Express/MariaDB backend, with real ML. Baseline screenshots use original page markup with reference-only fixes for the old mock initialization/guard race. Screenshots are under /root/corallink-browser-tools/layout-review. These checks are distinct from production frontend verification.

Backend runtime is /opt/corallink-api. Database/source backup: /root/corallink-deploy/publishing-backup. Permanent ML startup is enabled as corallink-ml.service, running the existing model and application as a non-root user at loopback port 5000. No Nginx changes.

Verified 10 September 2026: isolated browser suite passes publication/cover persistence, original milestone editor, restored investment and confirmation layouts, proof upload Pending, explicit admin approval, and investor Completed status without uncaught page exceptions. All four original layouts have comparison screenshots. Compiled CSS SHA-256 is identical to the pre-integration reference: 4567f369f9eaa468f5fb68ec56b199acc37f6166e7fed66f3d81f18833fd4585.

The live API also passed register using name/phone, /auth/me, multipart project creation with server ML, public cover, detail and milestone persistence. Temporary production test account/project/files were removed. Payment approval tests used only isolated databases and do not represent real money received.
