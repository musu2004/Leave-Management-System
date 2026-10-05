import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Alert, Page } from "../components/ui.jsx";

export default function ApplyLeave() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ leaveTypeId: "", startDate: "", endDate: "", reason: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [manager, setManager] = useState(undefined); // undefined = loading, null = none

  useEffect(() => {
    api.leaveTypes().then(setTypes).catch((e) => setError(e.message));

    // Find this employee's reporting manager (the request goes only to them)
    if (!user.empId) { setManager(null); return; }
    api.employee(user.empId)
      .then(async (me) => {
        if (!me.managerId) return setManager(null);
        try {
          const m = await api.employee(me.managerId);
          setManager({ id: m.empId, name: m.empName });
        } catch {
          setManager({ id: me.managerId, name: "Unknown" });
        }
      })
      .catch(() => setManager(null));
  }, [user.empId]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!user.empId) return setError("Your account is not linked to an employee ID");
    setBusy(true);
    try {
      await api.applyLeave({
        empId: user.empId,
        leaveTypeId: Number(form.leaveTypeId),
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });
      navigate("/my-leaves");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page title="Apply for leave" subtitle="Weekends and company holidays are not counted.">
      <form className="card shadow-sm p-4" style={{ maxWidth: 720 }} onSubmit={submit}>
        <Alert>{error}</Alert>
        {manager === null && (
          <Alert type="warning">You don't have a reporting manager assigned, so your request cannot be sent. Please contact HR.</Alert>
        )}
        {manager && (
          <Alert type="success">This request will be sent to your reporting manager: <strong>{manager.name}</strong> (Manager ID: {manager.id}).</Alert>
        )}

        <div className="mb-3">
          <label className="form-label">Leave type</label>
          <select className="form-select" value={form.leaveTypeId} onChange={set("leaveTypeId")} required>
            <option value="">Select a type</option>
            {types.map((t) => (
              <option key={t.leaveTypeId} value={t.leaveTypeId}>{t.leaveTypeName}</option>
            ))}
          </select>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Start date</label>
            <input type="date" className="form-control" value={form.startDate} onChange={set("startDate")} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">End date</label>
            <input type="date" className="form-control" value={form.endDate} min={form.startDate} onChange={set("endDate")} required />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Reason</label>
          <textarea className="form-control" rows="3" maxLength={200} value={form.reason} onChange={set("reason")} required />
          <div className="form-text">{form.reason.length}/200</div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary" disabled={busy || !manager}>{busy ? "Submitting..." : "Submit request"}</button>
          <Link to="/" className="btn btn-outline-secondary">Cancel</Link>
        </div>
      </form>
    </Page>
  );
}
