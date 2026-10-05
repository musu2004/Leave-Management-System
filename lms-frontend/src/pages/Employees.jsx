import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { Alert, Empty, Page } from "../components/ui.jsx";

export default function Employees() {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api.employees().then(setList).catch((e) => setError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function remove(id) {
    if (!window.confirm("Delete employee " + id + "?")) return;
    try { await api.deleteEmployee(id); load(); } catch (err) { setError(err.message); }
  }

  return (
    <Page title="Employees" subtitle="Everyone creates their own account on the sign-up page; IDs are generated automatically">
      <Alert>{error}</Alert>

      <h2 className="h5">All employees</h2>
      {list.length === 0 ? (
        <Empty>No employees yet.</Empty>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover bg-white align-middle">
            <thead className="table-light"><tr><th>ID</th><th>Name</th><th>Designation</th><th>Dept</th><th>Manager</th><th>Email</th><th></th></tr></thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.empId}>
                  <td>{e.empId}</td><td>{e.empName}</td><td>{e.designation}</td><td>{e.deptId ?? "-"}</td><td>{e.managerId ?? "-"}</td><td>{e.email}</td>
                  <td><button className="btn btn-outline-danger btn-sm" onClick={() => remove(e.empId)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Page>
  );
}
