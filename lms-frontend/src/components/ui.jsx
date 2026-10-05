import { Link } from "react-router-dom";

export function Page({ title, subtitle, children, back = true }) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-1">
        <h1 className="h3 m-0" style={{ color: "#064e3b" }}>{title}</h1>
        {back && <Link to="/" className="btn btn-outline-success btn-sm">← Back to Dashboard</Link>}
      </div>
      {subtitle && <p className="text-secondary">{subtitle}</p>}
      {children}
    </div>
  );
}

export function Alert({ type = "danger", children }) {
  if (!children) return null;
  return <div className={"alert alert-" + type}>{children}</div>;
}

const COLORS = { PENDING: "warning text-dark", APPROVED: "success", REJECTED: "danger", CANCELLED: "secondary" };

export function Status({ value }) {
  return <span className={"badge rounded-pill bg-" + (COLORS[value] || "secondary")}>{value}</span>;
}

export function Empty({ children }) {
  return <div className="empty-box text-center text-secondary p-4">{children}</div>;
}

// Backend sends LocalDate as "2026-10-04" and LocalDateTime as an ISO string.
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "-";
