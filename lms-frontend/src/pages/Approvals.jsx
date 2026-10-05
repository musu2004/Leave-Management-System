import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Alert, Empty, Page, Status, fmtDate } from "../components/ui.jsx";

// The backend has no "pending for manager" endpoint, so we:
//   1) load the team  2) load each member's leaves  3) keep the PENDING ones.
export default function Approvals() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [types, setTypes] = useState([]);
  const [comments, setComments] = useState({});
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const load = useCallback(async () => {
    try {
      const [team, t] = await Promise.all([api.team(user.empId), api.leaveTypes()]);
      setTypes(t);
      const all = await Promise.all(
        team.map((m) => api.myLeaves(m.empId).then((ls) => ls.map((l) => ({ ...l, empName: m.empName }))))
      );
      setPending(all.flat().filter((l) => l.status === "PENDING").sort((a, b) => a.leaveId - b.leaveId));
    } catch (err) {
      setError(err.message);
    }
  }, [user.empId]);

  useEffect(() => { load(); }, [load]);

  async function decide(leave, approve) {
    setError(""); setOk("");
    const comment = comments[leave.leaveId] || "";
    try {
      if (approve) await api.approve(leave.leaveId, user.empId, comment);
      else await api.reject(leave.leaveId, user.empId, comment);
      setOk("Request #" + leave.leaveId + (approve ? " approved" : " rejected"));
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const typeName = (id) => types.find((t) => t.leaveTypeId === id)?.leaveTypeName || "Leave #" + id;

  return (
    <Page title="Approvals" subtitle="Pending leave requests from your team">
      <Alert>{error}</Alert>
      <Alert type="success">{ok}</Alert>
      {pending.length === 0 ? (
        <Empty>No pending requests.</Empty>
      ) : (
        <div className="row g-3">
          {pending.map((l) => (
            <div className="col-md-6" key={l.leaveId}>
              <div className="card shadow-sm h-100"><div className="card-body">
                <div className="d-flex justify-content-between">
                  <strong>{l.empName} <span className="text-secondary">(#{l.empId})</span></strong>
                  <Status value="PENDING" />
                </div>
                <p className="mb-1 mt-2">{typeName(l.leaveTypeId)} · {fmtDate(l.startDate)} → {fmtDate(l.endDate)} · {l.noOfDaysRequested} day(s)</p>
                <p className="text-secondary fst-italic">"{l.reason}"</p>
                <input
                  className="form-control mb-3"
                  placeholder="Comment (optional)"
                  maxLength={200}
                  value={comments[l.leaveId] || ""}
                  onChange={(e) => setComments({ ...comments, [l.leaveId]: e.target.value })}
                />
                <div className="d-flex gap-2">
                  <button className="btn btn-success" onClick={() => decide(l, true)}>Approve</button>
                  <button className="btn btn-outline-danger" onClick={() => decide(l, false)}>Reject</button>
                </div>
              </div></div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}
