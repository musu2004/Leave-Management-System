import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { Alert, Page } from "../components/ui.jsx";

export default function Allocate() {
  const [employees, setEmployees] = useState([]);
  const [types, setTypes] = useState([]);
  const [empId, setEmpId] = useState("");
  const [typeId, setTypeId] = useState("ALL");
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    Promise.all([api.employees(), api.leaveTypes()])
      .then(([e, t]) => { setEmployees(e); setTypes(t); })
      .catch((err) => setError(err.message));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError(""); setOk("");
    try {
      const ids = typeId === "ALL" ? types.map((t) => t.leaveTypeId) : [Number(typeId)];
      for (const id of ids) await api.allocate(empId, id, year);
      setOk("Allocated " + ids.length + " leave type(s) to employee " + empId + " for " + year);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Page title="Allocate leave balance" subtitle="Give an employee their yearly quota">
      <Alert>{error}</Alert>
      <Alert type="success">{ok}</Alert>
      <form className="card shadow-sm p-4" style={{ maxWidth: 560 }} onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Employee</label>
          <select className="form-select" value={empId} onChange={(e) => setEmpId(e.target.value)} required>
            <option value="">Select employee</option>
            {employees.map((e) => (<option key={e.empId} value={e.empId}>{e.empId} — {e.empName}</option>))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Leave type</label>
          <select className="form-select" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
            <option value="ALL">All leave types</option>
            {types.map((t) => (<option key={t.leaveTypeId} value={t.leaveTypeId}>{t.leaveTypeName} ({t.annualQuota} days)</option>))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Year</label>
          <input type="number" className="form-control" value={year} onChange={(e) => setYear(Number(e.target.value))} required />
        </div>
        <div className="d-flex gap-2"><button className="btn btn-primary">Allocate</button><Link to="/" className="btn btn-outline-secondary">Cancel</Link></div>
      </form>
    </Page>
  );
}
