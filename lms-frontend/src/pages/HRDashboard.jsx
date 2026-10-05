import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Alert, Empty, fmtDate } from "../components/ui.jsx";

export default function HRDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [types, setTypes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.employees(), api.leaveTypes(), api.holidays()])
      .then(([e, t, h]) => { setEmployees(e); setTypes(t); setHolidays(h); })
      .catch((err) => setError(err.message));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = holidays
    .filter((h) => h.holidayDate >= today)
    .sort((a, b) => a.holidayDate.localeCompare(b.holidayDate));

  const stats = [
    ["Employees", employees.length],
    ["Leave types", types.length],
    ["Holidays", holidays.length],
    ["Upcoming holidays", upcoming.length],
  ];

  return (
    <div>
      <div className="banner">
        <h1 className="h3 mb-1">Hello, {user.name || user.username} 👋</h1>
        <div className="opacity-75">HR administration overview</div>
      </div>
      <Alert>{error}</Alert>

      <div className="row g-3">
        {stats.map(([label, value]) => (
          <div className="col-6 col-md-3" key={label}>
            <div className="card h-100"><div className="card-body">
              <div className="text-secondary small">{label}</div>
              <div className="stat-number">{value}</div>
            </div></div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-wrap gap-2 mt-4">
        <Link className="btn btn-primary btn-sm" to="/hr/allocate">Allocate balance</Link>
        <Link className="btn btn-outline-success btn-sm" to="/hr/leave-types">Leave types</Link>
        <Link className="btn btn-outline-success btn-sm" to="/hr/holidays">Holidays</Link>
        <Link className="btn btn-outline-success btn-sm" to="/hr/employees">Employees</Link>
      </div>

      <h2 className="h5 mt-4" style={{ color: "#064e3b" }}>Upcoming holidays</h2>
      {upcoming.length === 0 ? (
        <Empty>No upcoming holidays. Add some in the Holidays page.</Empty>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light"><tr><th>Date</th><th>Holiday</th></tr></thead>
            <tbody>
              {upcoming.slice(0, 5).map((h) => (<tr key={h.id}><td>{fmtDate(h.holidayDate)}</td><td>{h.holidayName}</td></tr>))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
