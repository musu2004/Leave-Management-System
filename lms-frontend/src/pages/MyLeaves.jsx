import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Alert, Empty, Page, Status, fmtDate } from "../components/ui.jsx";

export default function MyLeaves() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user.empId) return;
    try {
      setTypes(await api.leaveTypes());
      setLeaves(await api.myLeaves(user.empId));
    } catch (err) {
      setError(err.message);
    }
  }, [user.empId]);

  useEffect(() => { load(); }, [load]);

  async function cancel(id) {
    if (!window.confirm("Cancel this leave request?")) return;
    try {
      await api.cancelLeave(id, user.empId);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const typeName = (id) => types.find((t) => t.leaveTypeId === id)?.leaveTypeName || "Leave #" + id;
  const rows = [...leaves].sort((a, b) => b.leaveId - a.leaveId);

  return (
    <Page title="My leaves" subtitle="Your full leave history">
      <Alert>{error}</Alert>
      {rows.length === 0 ? (
        <Empty>No leave requests yet.</Empty>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover bg-white align-middle">
            <thead className="table-light"><tr><th>#</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.leaveId}>
                  <td>{l.leaveId}</td>
                  <td>{typeName(l.leaveTypeId)}</td>
                  <td>{fmtDate(l.startDate)}</td>
                  <td>{fmtDate(l.endDate)}</td>
                  <td>{l.noOfDaysRequested}</td>
                  <td>{l.reason}</td>
                  <td><Status value={l.status} /></td>
                  <td>{l.status === "PENDING" && <button className="btn btn-outline-danger btn-sm" onClick={() => cancel(l.leaveId)}>Cancel</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Page>
  );
}
