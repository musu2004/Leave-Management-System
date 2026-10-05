import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { Alert, Empty, Page, fmtDate } from "../components/ui.jsx";

export default function Holidays() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ holidayName: "", holidayDate: "" });
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api.holidays()
      .then((h) => setList([...h].sort((a, b) => a.holidayDate.localeCompare(b.holidayDate))))
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.addHoliday(form);
      setForm({ holidayName: "", holidayDate: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Page title="Holiday calendar" subtitle="Holidays are excluded from leave day counts">
      <Alert>{error}</Alert>
      <form className="card shadow-sm p-4 mb-4" style={{ maxWidth: 720 }} onSubmit={submit}>
        <div className="row g-3">
          <div className="col-md-7">
            <label className="form-label">Holiday name</label>
            <input className="form-control" value={form.holidayName} onChange={(e) => setForm({ ...form, holidayName: e.target.value })} required />
          </div>
          <div className="col-md-5">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={form.holidayDate} onChange={(e) => setForm({ ...form, holidayDate: e.target.value })} required />
          </div>
        </div>
        <div className="mt-3"><button className="btn btn-primary">Add holiday</button></div>
      </form>

      {list.length === 0 ? (
        <Empty>No holidays added.</Empty>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover bg-white">
            <thead className="table-light"><tr><th>Date</th><th>Holiday</th></tr></thead>
            <tbody>{list.map((h) => (<tr key={h.id}><td>{fmtDate(h.holidayDate)}</td><td>{h.holidayName}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </Page>
  );
}
