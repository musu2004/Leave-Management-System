import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Alert, Empty, Page, Status, fmtDate } from "../components/ui.jsx";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const year = new Date().getFullYear();
  const [balances, setBalances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [unread, setUnread] = useState(0);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState("");
  const [manager, setManager] = useState(undefined); // undefined = loading, null = none

  useEffect(() => {
    if (!user.empId) return;
    (async () => {
      try {
        // Reporting manager (read-only info)
        try {
          const me = await api.employee(user.empId);
          if (me.managerId) {
            try {
              const m = await api.employee(me.managerId);
              setManager({ id: m.empId, name: m.empName });
            } catch {
              setManager({ id: me.managerId, name: "Unknown" });
            }
          } else {
            setManager(null);
          }
        } catch {
          setManager(null);
        }

        const t = await api.leaveTypes();
        setTypes(t);

        // One balance per leave type; an error just means HR hasn't allocated it yet
        const rows = await Promise.all(
          t.map((lt) =>
            api.balance(user.empId, lt.leaveTypeId, year)
              .then((b) => ({ ...b, name: lt.leaveTypeName }))
              .catch(() => null)
          )
        );
        setBalances(rows.filter(Boolean));

        setLeaves(await api.myLeaves(user.empId));
        const n = await api.notifications(user.empId);
        setUnread(n.filter((x) => !x.readFlag).length);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [user.empId, year]);

  if (!user.empId) {
    return (
      <Page title="Dashboard" back={false}>
        <Alert type="info">Your account is not linked to an employee profile.</Alert>
      </Page>
    );
  }

  const count = (s) => leaves.filter((l) => l.status === s).length;
  const typeName = (id) => types.find((t) => t.leaveTypeId === id)?.leaveTypeName || "Leave #" + id;
  const recent = [...leaves].sort((a, b) => b.leaveId - a.leaveId).slice(0, 5);

  const stats = [
    ["Pending", count("PENDING")],
    ["Approved", count("APPROVED")],
    ["Rejected", count("REJECTED")],
    ["Unread alerts", unread],
  ];

  return (
    <div>
      <div className="banner">
        <h1 className="h3 mb-1">Hello, {user.name || user.username} 👋</h1>
        <div className="opacity-75">Your leave overview for {year}</div>
        <div className="banner-info mt-3">
          {manager === undefined
            ? "Loading your reporting manager..."
            : manager
              ? <>👤 You are working under <strong>{manager.name}</strong> (Manager ID: {manager.id})</>
              : "👤 No reporting manager assigned yet."}
        </div>
      </div>
      <Alert>{error}</Alert>

      <div className="row g-3">
        {stats.map(([label, value]) => (
          <div className="col-6 col-md-3" key={label}>
            <div className="card shadow-sm h-100"><div className="card-body">
              <div className="text-secondary small">{label}</div>
              <div className="stat-number">{value}</div>
            </div></div>
          </div>
        ))}
      </div>

      <h2 className="h5 mt-4" style={{ color: "#064e3b" }}>Leave balance</h2>
      {balances.length === 0 ? (
        <Empty>No balances allocated yet. Ask HR to allocate your leave.</Empty>
      ) : (
        <div className="row g-3">
          {balances.map((b) => {
            const pct = b.totalAllocatedDays ? Math.max(0, (b.remainingDays / b.totalAllocatedDays) * 100) : 0;
            return (
              <div className="col-md-6 col-lg-4" key={b.balanceId}>
                <div className="card shadow-sm"><div className="card-body">
                  <div className="d-flex justify-content-between">
                    <strong>{b.name}</strong>
                    <span className="text-secondary">{b.remainingDays} / {b.totalAllocatedDays} days</span>
                  </div>
                  <div className="progress my-2" style={{ height: 8 }}>
                    <div className="progress-bar" style={{ width: pct + "%" }}></div>
                  </div>
                  <small className="text-secondary">{b.usedDays} used</small>
                </div></div>
              </div>
            );
          })}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <h2 className="h5 m-0">Recent requests</h2>
        <Link className="btn btn-primary btn-sm" to="/apply">+ Apply for leave</Link>
      </div>
      {recent.length === 0 ? (
        <Empty>You haven't applied for any leave yet.</Empty>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover bg-white align-middle">
            <thead className="table-light"><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
            <tbody>
              {recent.map((l) => (
                <tr key={l.leaveId}>
                  <td>{typeName(l.leaveTypeId)}</td>
                  <td>{fmtDate(l.startDate)}</td>
                  <td>{fmtDate(l.endDate)}</td>
                  <td>{l.noOfDaysRequested}</td>
                  <td><Status value={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
