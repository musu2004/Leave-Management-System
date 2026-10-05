import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Alert, Empty, Page } from "../components/ui.jsx";

export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user.empId) return;
    api.notifications(user.empId).then(setItems).catch((e) => setError(e.message));
  }, [user.empId]);

  return (
    <Page title="Notifications">
      <Alert>{error}</Alert>
      {items.length === 0 ? (
        <Empty>You're all caught up.</Empty>
      ) : (
        <ul className="list-group shadow-sm">
          {items.map((n) => (
            <li className="list-group-item" key={n.notificationId}>
              <div>{n.message}</div>
              <small className="text-secondary">{new Date(n.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
