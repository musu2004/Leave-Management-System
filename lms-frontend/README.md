# LeaveHub - Leave Management System (React + Bootstrap, "Emerald Soft" design)

Stack: HTML5, CSS3, JavaScript, React.js, Bootstrap 5 (responsive UI).
Backend: Spring Boot `com.nexturn.lms` on http://localhost:8080 (MySQL).

## Run
1. Start MySQL and run the backend in Eclipse (LeaveManagementSystemMainAppl).
2. In the VS Code terminal, inside this folder:
   npm install     (only needed once - already done if node_modules exists)
   npm run dev
3. Open http://localhost:5173

## Connection
- Backend URL: `.env` -> VITE_API_URL=http://localhost:8080
- All API calls: `src/api.js`
- CORS is allowed by @CrossOrigin on the backend controllers.

## Design files
- Theme colors, cards, buttons, sidebar: `src/custom.css`
- Sidebar / mobile menu: `src/components/Layout.jsx`
- Split-screen login: `src/pages/Login.jsx`

## First use
1. Open http://localhost:5173/register
2. Fill in details, choose a role (HR first), set a password. Your EMAIL is your User ID.
3. Sign in with: email + password (your role comes from your account).

## Who sees what
- Employee: Dashboard, Apply for Leave, My Leaves, Notifications
- Reporting Manager: Dashboard, My Team, Approvals
- HR / Admin: Dashboard, Employees, Leave Types, Holidays, Allocate Balance

## Backend endpoint needed (Eclipse)
GET /api/employees/managers  -> employees whose login role is MANAGER (used by the sign-up page).

## Calendar
Floating calendar button (bottom-right) on every page after sign-in: shows the month, today, company holidays and (for employees) approved leave.

## Reporting manager rules
- Employee dashboard shows 'You are working under <manager> (Manager ID)'.
- Apply page shows who the request goes to and is blocked if no manager is assigned.
- Manager sees only his/her own team's requests (GET /api/manager/{id}/team + that team's leaves);
  the backend (ApprovalService) also rejects approval by any other manager.
