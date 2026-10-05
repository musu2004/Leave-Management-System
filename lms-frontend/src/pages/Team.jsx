import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Alert, Empty, Page } from "../components/ui.jsx";

export default function Team() {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.team(user.empId).then(setTeam).catch((e) => setError(e.message));
  }, [user.empId]);

  return (
    <Page title="My team" subtitle="Employees who report to you">
      <Alert>{error}</Alert>
      {team.length === 0 ? (
        <Empty>No one reports to you yet.</Empty>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover bg-white">
            <thead className="table-light"><tr><th>ID</th><th>Name</th><th>Designation</th><th>Email</th><th>Phone</th></tr></thead>
            <tbody>
              {team.map((e) => (
                <tr key={e.empId}><td>{e.empId}</td><td>{e.empName}</td><td>{e.designation}</td><td>{e.email}</td><td>{e.phoneNumber}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Page>
  );
}
