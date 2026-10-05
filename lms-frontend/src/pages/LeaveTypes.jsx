import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { Alert, Empty, Page } from "../components/ui.jsx";

const blank = { leaveTypeName: "", description: "", annualQuota: "", allowNegativeBalance: false };

export default function LeaveTypes() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api.leaveTypes().then(setList).catch((e) => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.createLeaveType({ ...form, annualQuota: Number(form.annualQuota) });
      setForm(blank);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Page title="Leave types" subtitle="Define the kinds of leave and their yearly quota">
      <Alert>{error}</Alert>
      <form className="card shadow-sm p-4 mb-4" onSubmit={submit}>
        <h2 className="h5 mb-3">Add leave type</h2>
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label">Name</label>
            <input className="form-control" value={form.leaveTypeName} onChange={(e) => setForm({ ...form, leaveTypeName: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Annual quota (days)</label>
            <input type="number" min="0" className="form-control" value={form.annualQuota} onChange={(e) => setForm({ ...form, annualQuota: e.target.value })} required />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <input className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="col-12 form-check ms-2">
            <input type="checkbox" id="neg" className="form-check-input" checked={form.allowNegativeBalance} onChange={(e) => setForm({ ...form, allowNegativeBalance: e.target.checked })} />
            <label htmlFor="neg" className="form-check-label">Allow negative balance</label>
          </div>
        </div>
        <div className="mt-3"><button className="btn btn-primary">Add leave type</button></div>
      </form>

      {list.length === 0 ? (
        <Empty>No leave types yet.</Empty>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover bg-white">
            <thead className="table-light"><tr><th>ID</th><th>Name</th><th>Description</th><th>Quota</th><th>Negative allowed</th></tr></thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.leaveTypeId}><td>{t.leaveTypeId}</td><td>{t.leaveTypeName}</td><td>{t.description}</td><td>{t.annualQuota}</td><td>{t.allowNegativeBalance ? "Yes" : "No"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Page>
  );
}
