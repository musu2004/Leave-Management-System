# LeaveHub - Leave Management System (Create React App + Bootstrap, "Emerald Soft" design)

Stack: HTML5, CSS3, JavaScript, React.js (create-react-app), Bootstrap 5.
Backend: Spring Boot `com.nexturn.lms` on http://localhost:8080 (MySQL).

## Run
1. Start MySQL and run the backend in Eclipse (LeaveManagementSystemMainAppl).
2. In the VS Code terminal, inside this folder:
   npm install
   npm start
3. Browser opens http://localhost:3000

## Connection
- Backend URL: `.env` -> REACT_APP_API_URL=http://localhost:8080   (restart `npm start` after editing .env)
- All API calls: `src/api.js`
- CORS is allowed by @CrossOrigin on the backend controllers.

## First use
1. Open http://localhost:3000/register
2. Fill in details, choose a role (HR first), set a password. Your EMAIL is your User ID.
3. Sign in with: email + password (your role comes from your account).

## Who sees what
- Employee: Dashboard, Apply for Leave, My Leaves, Notifications
- Reporting Manager: Dashboard, My Team, Approvals
- HR / Admin: Dashboard, Employees, Leave Types, Holidays, Allocate Balance

## Backend endpoint needed
GET /api/employees/managers -> employees whose login role is MANAGER (sign-up page dropdown).

## Build for production
npm run build   (creates the build/ folder)
