# LeaveHub: Leave Management System

A leave management system for a company with employees, reporting managers and HR. Employees apply for leave, the manager they report to approves or rejects it, and HR owns the rules: leave types, holidays and yearly balances. Every status change leaves a notification and an audit entry behind.

Backend is Spring Boot 3.5 on Java 21 with MySQL (`com.nexturn.lms`). A React frontend is included in `lms-frontend/`.

**Status:** accounts and roles, employee management, leave types, holidays, yearly balances, leave application, manager approval and rejection, cancellation, notifications, audit log, and the React frontend are all implemented. The service layer has 16 integration tests. Two things are scaffolded but not finished: the monthly accrual job (scheduled, body empty) and server-side authorization (see [Known limitations](#known-limitations--roadmap)). Read that section before deploying this anywhere public.

The rules live in one place. Controllers only translate HTTP; every decision, such as working-day counting, balance checks and "is this the right manager", is made in the service layer and is the same no matter which screen or client calls it.

## Table of Contents

- [Documentation](#documentation)
- [Running it](#running-it)
- [Configuration](#configuration)
- [Getting your first accounts](#getting-your-first-accounts)
- [What to show a reviewer](#what-to-show-a-reviewer)
- [API reference](#api-reference)
- [Business rules](#business-rules)
- [Data model](#data-model)
- [Error handling](#error-handling)
- [Tests](#tests)
- [Layout](#layout)
- [Invariants worth knowing](#invariants-worth-knowing)
- [Known limitations & roadmap](#known-limitations--roadmap)

---

## Documentation

| Document | What it covers |
|---|---|
| This README | Setup, API, rules, data model, limitations |
| Swagger UI | Interactive API docs, generated from the controllers: http://localhost:8080/swagger-ui/index.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |
| `lms-frontend/README.md` | Frontend run instructions, role-to-screen map, design files |

## Running it

**Prerequisites:** JDK 21, Maven 3.9+ (or your IDE's bundled Maven), MySQL 8+, and Node.js 18+ for the frontend.

### 0. Database (first time only)

```sql
CREATE DATABASE leave_management_system;
```

Tables are created automatically on first start (`spring.jpa.hibernate.ddl-auto=update`). There is no seed script, and the database starts empty.

### 1. Backend (http://localhost:8080)

```bash
mvn spring-boot:run
```

Or run `LeaveManagementSystemMainAppl` from your IDE. API docs are at `/swagger-ui/index.html`.

### 2. Frontend (http://localhost:3000)

```bash
cd lms-frontend
npm install
npm start
```

The frontend reads the backend address from `lms-frontend/.env` (`REACT_APP_API_URL=http://localhost:8080`).

### Backend only

The frontend is optional. Everything it does goes through the REST API below, so you can drive the whole system with Swagger UI or `curl`.

### Production build

```bash
mvn clean package
java -jar target/leave-management-system-0.0.1-SNAPSHOT.jar

cd lms-frontend && npm run build     # static files in lms-frontend/dist
```

## Configuration

`src/main/resources/application.properties`

| Property | Default | Description |
|---|---|---|
| `server.port` | `8080` | HTTP port |
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/leave_management_system` | JDBC URL |
| `spring.datasource.username` | `root` | DB user |
| `spring.datasource.password` | `root` | DB password |
| `spring.jpa.hibernate.ddl-auto` | `update` | Schema management |
| `spring.jpa.show-sql` | `true` | Log SQL |

Spring Boot reads environment variables over this file, so real credentials don't need to be committed: set `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`.

`lms-frontend/.env`: `REACT_APP_API_URL`, the backend base URL.

## Getting your first accounts

There are no seeded users. The first account has to be created through the API or the sign-up page, and **the email address is the User ID**.

Through the UI: open http://localhost:3000/register, register an **HR** user first, then a **Reporting Manager**, then employees (who pick their manager during sign-up).

Through the API:

```bash
# 1. create the employee record (ID is assigned automatically, starting at 1000)
curl -X POST localhost:8080/api/employees -H "Content-Type: application/json" -d '{
  "empName":"Asha Rao","email":"asha@company.com","designation":"HR Lead",
  "gender":"Female","address":"Hyderabad","deptId":10}'

# 2. create the login for that email
curl -X POST localhost:8080/api/login/user -H "Content-Type: application/json" -d '{
  "username":"asha@company.com","password":"Password@123","role":"HR"}'
```

Passwords are stored as BCrypt hashes.

| Role | Intended to |
|---|---|
| `EMPLOYEE` | Apply for leave, view own history and notifications |
| `MANAGER` | See own team, approve or reject the team's requests |
| `HR` / `ADMIN` | Manage employees, leave types, holidays and balances |

Which role sees which screen is decided in the React app. The API itself does not enforce it yet (see limitations).

## What to show a reviewer

These are in the order that tells the story best. Dates below assume the system date is early October 2026.

**Setup (as HR).** Create a leave type, "Casual Leave" with an annual quota of 12. Add a holiday on Monday 12 Oct 2026. Allocate a 2026 balance to an employee; the balance copies the leave type's quota (12 total, 0 used, 12 remaining).

**Working days, not calendar days.** As that employee, apply for leave from Fri 9 Oct to Tue 13 Oct. That is five calendar days, but the request records **2** days. Saturday, Sunday and the Monday holiday were skipped. The number is computed by the server, so the frontend can't send a different one.

**Approval is tied to the reporting line.** Sign in as a manager who is *not* this employee's manager and try to approve. It is refused with "Manager is not assigned to this employee". The check compares the manager ID on the employee record with the ID in the request, so another manager can't bypass it from the UI or by calling the API directly.

**The balance moves on approval only.** Approve as the right manager and look at the balance: 2 used, 10 remaining. A rejection leaves it at 12. The request, the manager's decision and comment, the audit entry and the employee's notification are all written in one transaction, so a failure part-way through leaves nothing half-done.

**A decision is final.** Try to approve the same request again, or cancel it. Both are refused: only `PENDING` requests can be decided, and only the owner can cancel, and only while it is still `PENDING`.

**Insufficient balance.** Apply for more working days than the balance holds. It is refused with "Insufficient leave balance", unless HR created the leave type with `allowNegativeBalance: true`.

**Trace.** `GET /api/employees/{id}/audit` and `/notifications` show the history of everything above, with timestamps.

## API reference

Base URL `http://localhost:8080`. Full, interactive version in Swagger UI.

### Login: `/api/login`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Check credentials; returns `username` and `role` |
| POST | `/api/login/user` | Create a login (password hashed) |

### Employees: `/api/employees`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | List all |
| GET | `/api/employees/managers` | Employees whose login role is `MANAGER` |
| GET | `/api/employees/{id}` | One employee |
| POST | `/api/employees` | Create (ID auto-assigned from 1000) |
| PUT | `/api/employees/{id}` | Update |
| DELETE | `/api/employees/{id}` | Delete |
| GET | `/api/employees/{id}/notifications` | Notifications |
| GET | `/api/employees/{id}/audit` | Audit log |

### Leaves: `/api/leaves`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leaves` | Apply |
| GET | `/api/leaves/{id}` | One application |
| GET | `/api/leaves/employee/{empId}` | History |
| PUT | `/api/leaves/{leaveId}/cancel/{empId}` | Cancel a pending leave |

```json
{ "empId": 1000, "leaveTypeId": 1, "startDate": "2026-10-09", "endDate": "2026-10-13", "reason": "Family function" }
```

`reason` is required and limited to 200 characters.

### Manager: `/api/manager`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/manager/{managerId}/team` | Direct reports |
| POST | `/api/manager/leave/{leaveId}/approve` | Approve |
| POST | `/api/manager/leave/{leaveId}/reject` | Reject |

```json
{ "managerId": 1001, "comment": "Approved. Enjoy!" }
```

### HR: `/api/hr`

| Method | Endpoint | Description |
|---|---|---|
| GET / POST | `/api/hr/leave-types` | List / create leave types |
| GET / POST | `/api/hr/holidays` | List / add holidays |
| GET | `/api/hr/employees` | List employees |
| POST | `/api/hr/leave-balances?empId=&leaveTypeId=&year=` | Allocate a yearly balance from the type's quota |
| GET | `/api/hr/leave-balances/{empId}/{leaveTypeId}/{year}` | Read a balance |

```json
{ "leaveTypeName": "Casual Leave", "description": "Personal work", "annualQuota": 12, "allowNegativeBalance": false }
```

```json
{ "holidayDate": "2026-10-12", "holidayName": "Founders' Day" }
```

## Business rules

**Applying**
1. The end date may not be before the start date.
2. The leave type must exist.
3. Days are counted as weekdays that are not holidays; at least one is required.
4. A balance must already exist for the employee, leave type and the year of the **start date**.
5. If the type does not allow a negative balance, remaining days must cover the request.
6. The request is saved as `PENDING`, with an audit entry and a notification.

**Deciding**
- Only `PENDING` requests can be approved or rejected.
- The manager in the request must be the manager assigned to the employee.
- Approval adds to used days and recalculates remaining days. Rejection changes no balance.

**Cancelling**
- Only the owner, and only while `PENDING`.

```
PENDING ──► APPROVED
   ├──────► REJECTED
   └──────► CANCELLED
```

**Sign-up (frontend):** the register page creates the employee, then the login. If the login step fails, it deletes the employee it just created so no orphan is left behind.

## Data model

| Table | Holds |
|---|---|
| `login` | Credentials and role; `username` (the email) is the key |
| `employee` | Profile, department, `managerId`; email and phone are unique |
| `leave_type` | Name, annual quota, `allowNegativeBalance` |
| `leave_balance` | Allocated / used / remaining days; unique on `(emp_id, leave_type_id, year)` |
| `leave_application` | Requests and their status |
| `approval` | One row per manager decision, with comment and time |
| `holiday` | Company holiday dates |
| `notification` | Per-employee messages with a read flag |
| `audit_log` | Status-change history |

Statuses, roles and notification types are stored as strings (`EnumType.STRING`), so the database stays readable.

## Error handling

A global handler turns failures into JSON:

| Exception | Status | Body |
|---|---|---|
| `ResourceNotFoundException` | 404 | `{"message": "Leave balance not found"}` |
| `BusinessException` | 400 | `{"message": "Insufficient leave balance"}` |
| Bean validation failure | 400 | `{"message": "Invalid request data"}` |

The login deliberately returns the same message for an unknown username and a wrong password, so the endpoint doesn't reveal which usernames exist.

## Tests

```bash
mvn test
```

16 tests across five service classes: login (valid, wrong password, unknown user), employee (save, list, get, team), leave type (save, list, get), leave application (success, invalid dates, insufficient balance) and approval (approve, reject, wrong manager).

They are `@SpringBootTest` and `@Transactional`: they run against the configured database, so **MySQL must be running**, but each test rolls back, so no fixture rows are left behind. Auto-increment counters do advance, so IDs won't be contiguous after a test run.

## Layout

```
pom.xml
src/main/java/com/nexturn/lms/
  LeaveManagementSystemMainAppl.java   entry point; scheduling enabled
  controller/   Login, Employee, Leave, Manager, HR; HTTP only, no rules here
  service/      every business rule; LeaveService, ApprovalService, LeaveBalanceService, ...
                LeaveScheduler (monthly accrual: scaffold only)
  repository/   Spring Data JPA
  entity/       the nine tables above
  dto/          validated request/response records
  enums/        Role, LeaveStatus, NotificationType
  exception/    BusinessException, ResourceNotFoundException, GlobalExceptionHandler
src/main/resources/application.properties
src/test/java/com/nexturn/lms/service/   the 16 tests
lms-frontend/
  src/api.js       every backend call, in one file
  src/auth.jsx     session (kept in localStorage)
  src/App.jsx      routes and role-gated routes
  src/pages/       login, register, dashboards, apply, approvals, HR screens
```

