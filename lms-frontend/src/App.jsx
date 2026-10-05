import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ApplyLeave from "./pages/ApplyLeave.jsx";
import MyLeaves from "./pages/MyLeaves.jsx";
import Notifications from "./pages/Notifications.jsx";
import Team from "./pages/Team.jsx";
import Approvals from "./pages/Approvals.jsx";
import Employees from "./pages/Employees.jsx";
import LeaveTypes from "./pages/LeaveTypes.jsx";
import Holidays from "./pages/Holidays.jsx";
import Allocate from "./pages/Allocate.jsx";

function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

const EMP = ["EMPLOYEE"];
const MGR = ["MANAGER"];
const HR = ["HR", "ADMIN"];

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Protected><Dashboard /></Protected>} />

      {/* Employee only */}
      <Route path="/apply" element={<Protected roles={EMP}><ApplyLeave /></Protected>} />
      <Route path="/my-leaves" element={<Protected roles={EMP}><MyLeaves /></Protected>} />
      <Route path="/notifications" element={<Protected roles={EMP}><Notifications /></Protected>} />

      {/* Reporting manager only */}
      <Route path="/team" element={<Protected roles={MGR}><Team /></Protected>} />
      <Route path="/approvals" element={<Protected roles={MGR}><Approvals /></Protected>} />

      {/* HR / Admin only */}
      <Route path="/hr/employees" element={<Protected roles={HR}><Employees /></Protected>} />
      <Route path="/hr/leave-types" element={<Protected roles={HR}><LeaveTypes /></Protected>} />
      <Route path="/hr/holidays" element={<Protected roles={HR}><Holidays /></Protected>} />
      <Route path="/hr/allocate" element={<Protected roles={HR}><Allocate /></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
