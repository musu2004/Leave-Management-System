// All backend calls live here. Base URL comes from .env (REACT_APP_API_URL).
const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach the server. Is the Spring Boot app running on " + BASE + "?");
  }

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error((data && data.message) || "Request failed (" + res.status + ")");
  }
  return data;
}

const post = (path, body) =>
  request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
const put = (path, body) =>
  request(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined });

export const api = {
  // Login  -> LoginController
  login: (username, password) => post("/api/login", { username, password }),
  createLogin: (username, password, role) =>
    post("/api/login/user", { username, password, role }),

  // Employees -> EmployeeController
  employees: () => request("/api/employees"),
  employee: (id) => request("/api/employees/" + id),
  managers: () => request("/api/employees/managers"),
  createEmployee: (e) => post("/api/employees", e),
  deleteEmployee: (id) => request("/api/employees/" + id, { method: "DELETE" }),
  notifications: (id) => request("/api/employees/" + id + "/notifications"),

  // Leaves -> LeaveController
  applyLeave: (body) => post("/api/leaves", body),
  myLeaves: (empId) => request("/api/leaves/employee/" + empId),
  cancelLeave: (leaveId, empId) => put("/api/leaves/" + leaveId + "/cancel/" + empId),

  // Manager -> ManagerController
  team: (managerId) => request("/api/manager/" + managerId + "/team"),
  approve: (leaveId, managerId, comment) =>
    post("/api/manager/leave/" + leaveId + "/approve", { managerId, comment }),
  reject: (leaveId, managerId, comment) =>
    post("/api/manager/leave/" + leaveId + "/reject", { managerId, comment }),

  // HR -> HRController
  leaveTypes: () => request("/api/hr/leave-types"),
  createLeaveType: (t) => post("/api/hr/leave-types", t),
  holidays: () => request("/api/hr/holidays"),
  addHoliday: (h) => post("/api/hr/holidays", h),
  allocate: (empId, leaveTypeId, year) =>
    post("/api/hr/leave-balances?empId=" + empId + "&leaveTypeId=" + leaveTypeId + "&year=" + year),
  balance: (empId, leaveTypeId, year) =>
    request("/api/hr/leave-balances/" + empId + "/" + leaveTypeId + "/" + year),
};
