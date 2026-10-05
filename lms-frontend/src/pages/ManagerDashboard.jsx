import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Alert, Empty, fmtDate } from "../components/ui.jsx";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [t, lt] = await Promise.all([api.team(user.empId), api.leaveTypes()]);
        setTeam(t);
        setTypes(lt);
        const all = await Promise.all(
          t.map((m) => api.myLeaves(m.empId).then((ls) => ls.map((l) => ({ ...l, empName: m.empName }))))
        );
        setLeaves(all.flat());
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [user.empId]);

  const count = (s) => leaves.filter((l) => l.status === s).length;
  const typeName = (id) => types.find((t) => t.leaveTypeId === id)?.leaveTypeName || "Leave #" + id;
  const pending = leaves.filter((l) => l.status === "PENDING").sort((a, b) => a.leaveId - b.leaveId);

  const stats = [
    ["Team members", team.length],
    ["Pending approvals", pending.length],
    ["Approved", count("APPROVED")],
    ["Rejected", count("REJECTED")],
  ];

  return (
    <div>
      <div className="banner">
        <h1 className="h3 mb-1">Hello, {user.name || user.username} 👋</h1>
        <div className="opacity-75">Your team overview</div>
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

      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h2 className="h5 m-0" style={{ color: "#064e3b" }}>Waiting for your decision</h2>
        <Link className="btn btn-primary btn-sm" to="/approvals">Go to approvals</Link>
      </div>
      {pending.length === 0 ? (
        <Empty>No pending requests from your team.</Empty>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light"><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th></tr></thead>
            <tbody>
              {pending.slice(0, 5).map((l) => (
                <tr key={l.leaveId}>
                  <td>{l.empName}</td><td>{typeName(l.leaveTypeId)}</td>
                  <td>{fmtDate(l.startDate)}</td><td>{fmtDate(l.endDate)}</td><td>{l.noOfDaysRequested}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
