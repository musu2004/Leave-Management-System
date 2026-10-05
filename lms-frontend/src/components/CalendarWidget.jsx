import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n) => String(n).padStart(2, "0");
const keyOf = (y, m, d) => y + "-" + pad(m + 1) + "-" + pad(d);

// Floating calendar button (bottom-right) shown on every page after sign-in
export default function CalendarWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [holidays, setHolidays] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (!open) return;
    api.holidays().then(setHolidays).catch(() => setHolidays([]));
    if (user.role === "EMPLOYEE" && user.empId) {
      api.myLeaves(user.empId)
        .then((ls) => setLeaves(ls.filter((l) => l.status === "APPROVED")))
        .catch(() => setLeaves([]));
    }
  }, [open, user.role, user.empId]);

  function shift(delta) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const holidayMap = {};
  holidays.forEach((h) => { holidayMap[h.holidayDate] = h.holidayName; });
  const onLeave = (k) => leaves.some((l) => l.startDate <= k && k <= l.endDate);
  const todayKey = keyOf(today.getFullYear(), today.getMonth(), today.getDate());

  const monthHolidays = holidays
    .filter((h) => h.holidayDate.startsWith(year + "-" + pad(month + 1)))
    .sort((a, b) => a.holidayDate.localeCompare(b.holidayDate));

  return (
    <>
      {open && (
        <div className="cal-panel card">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <button className="btn btn-sm btn-outline-success" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
            <strong style={{ color: "#064e3b" }}>{MONTHS[month]} {year}</strong>
            <button className="btn btn-sm btn-outline-success" onClick={() => shift(1)} aria-label="Next month">›</button>
          </div>

          <div className="cal-grid text-center text-secondary small mb-1">
            {DAYS.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="cal-grid">
            {cells.map((d, i) => {
              if (d === null) return <div key={"e" + i} />;
              const k = keyOf(year, month, d);
              const weekday = (firstWeekday + d - 1) % 7;
              const cls = ["cal-day"];
              if (weekday === 0 || weekday === 6) cls.push("weekend");
              if (holidayMap[k]) cls.push("holiday");
              if (onLeave(k)) cls.push("leave");
              if (k === todayKey) cls.push("today");
              return <div key={k} className={cls.join(" ")} title={holidayMap[k] || ""}>{d}</div>;
            })}
          </div>

          <div className="d-flex flex-wrap gap-3 small mt-3">
            <span><i className="cal-dot today" /> Today</span>
            <span><i className="cal-dot holiday" /> Holiday</span>
            {user.role === "EMPLOYEE" && <span><i className="cal-dot leave" /> My approved leave</span>}
          </div>

          {monthHolidays.length > 0 && (
            <ul className="list-unstyled small mt-2 mb-0">
              {monthHolidays.map((h) => (
                <li key={h.id}><strong>{Number(h.holidayDate.slice(8))} {MONTHS[month].slice(0, 3)}</strong> – {h.holidayName}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="cal-wrap">
        <span className={"cal-label" + (location.pathname === "/" ? " always" : "")}>Calendar</span>
      <button className="cal-fab btn btn-primary" onClick={() => setOpen(!open)} aria-label="Open calendar" title="Calendar">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <circle cx="8.5" cy="15" r="1" fill="currentColor" /><circle cx="12" cy="15" r="1" fill="currentColor" /><circle cx="15.5" cy="15" r="1" fill="currentColor" />
        </svg>
      </button>
      </div>
    </>
  );
}
