import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ROLE_LABEL, useAuth } from "../auth.jsx";
import CalendarWidget from "./CalendarWidget.jsx";

const link = ({ isActive }) => "side-link" + (isActive ? " active" : "");

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHr = user.role === "HR" || user.role === "ADMIN";

  // On phones the sidebar is a slide-in panel: close it after choosing a page
  useEffect(() => {
    const el = document.getElementById("sideNav");
    if (el && el.classList.contains("show")) {
      const closeBtn = el.querySelector(".btn-close");
      if (closeBtn) closeBtn.click();
    }
  }, [location.pathname]);

  return (
    <div className="d-lg-flex min-vh-100">
      {/* Top bar – phones and tablets only */}
      <div className="topbar d-lg-none d-flex align-items-center justify-content-between px-3 py-2">
        <span className="d-flex align-items-center gap-2 fw-bold fs-5" style={{ color: "#064e3b" }}>
          <span className="brand-logo">L</span> LeaveHub
        </span>
        <button
          className="btn btn-outline-success btn-sm"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sideNav"
        >
          ☰ Menu
        </button>
      </div>

      {/* Sidebar – permanent on desktop, off-canvas on small screens */}
      <aside className="sidebar offcanvas-lg offcanvas-start" tabIndex="-1" id="sideNav">
        <div className="offcanvas-header d-lg-none">
          <span className="fw-bold">Menu</span>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sideNav"></button>
        </div>

        <div className="offcanvas-body d-flex flex-column p-3 h-100">
          <div className="d-none d-lg-flex align-items-center gap-2 fw-bold fs-4 mb-3 px-2" style={{ color: "#064e3b" }}>
            <span className="brand-logo">L</span> LeaveHub
          </div>

          <nav className="flex-grow-1 overflow-auto">
            <NavLink to="/" end className={link}>Dashboard</NavLink>

            {user.role === "EMPLOYEE" && (
              <>
                <div className="side-title">My Leave</div>
                <NavLink to="/apply" className={link}>Apply for Leave</NavLink>
                <NavLink to="/my-leaves" className={link}>My Leaves</NavLink>
                <NavLink to="/notifications" className={link}>Notifications</NavLink>
              </>
            )}

            {user.role === "MANAGER" && (
              <>
                <div className="side-title">Manager</div>
                <NavLink to="/team" className={link}>My Team</NavLink>
                <NavLink to="/approvals" className={link}>Approvals</NavLink>
              </>
            )}

            {isHr && (
              <>
                <div className="side-title">HR Admin</div>
                <NavLink to="/hr/employees" className={link}>Employees</NavLink>
                <NavLink to="/hr/leave-types" className={link}>Leave Types</NavLink>
                <NavLink to="/hr/holidays" className={link}>Holidays</NavLink>
                <NavLink to="/hr/allocate" className={link}>Allocate Balance</NavLink>
              </>
            )}
          </nav>

          <div className="user-box d-flex justify-content-between align-items-center">
            <div style={{ minWidth: 0 }}>
              <strong className="d-block text-truncate" style={{ maxWidth: 140 }}>{user.name || user.username}</strong>
              <span className="badge rounded-pill bg-success-subtle text-success-emphasis">{ROLE_LABEL[user.role] || user.role}</span>
            </div>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => { logout(); navigate("/login"); }}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="content-area flex-grow-1 p-3 p-lg-4">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>{children}</div>
      </main>

      <CalendarWidget />
    </div>
  );
}
