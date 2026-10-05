import { useAuth } from "../auth.jsx";
import EmployeeDashboard from "./EmployeeDashboard.jsx";
import ManagerDashboard from "./ManagerDashboard.jsx";
import HRDashboard from "./HRDashboard.jsx";

// Each role gets its own dashboard
export default function Dashboard() {
  const { user } = useAuth();
  if (user.role === "MANAGER") return <ManagerDashboard />;
  if (user.role === "HR" || user.role === "ADMIN") return <HRDashboard />;
  return <EmployeeDashboard />;
}
