import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { Alert } from "../components/ui.jsx";

const blank = {
  empName: "", email: "", phoneNumber: "", designation: "", gender: "Male", role: "EMPLOYEE",
  address: "", deptId: "", managerId: "", password: "", confirm: "",
};

// Sign-up. The email becomes the User ID (login username).
// Step 1: POST /api/employees  -> backend generates the internal employee number
// Step 2: POST /api/login/user -> username = email, password, role
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [people, setPeople] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const [mgrError, setMgrError] = useState("");

  // Only people who registered with the Reporting Manager role
  useEffect(() => {
    api.managers().then(setPeople).catch((err) => { setPeople([]); setMgrError(err.message); });
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");

    const email = form.email.trim().toLowerCase();
    if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber)) return setError("Phone number must be exactly 10 digits");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm) return setError("Passwords do not match");

    setBusy(true);
    let created = null;
    try {
      // Fresh list so duplicate checks are accurate
      const all = await api.employees();
      if (all.some((x) => (x.email || "").toLowerCase() === email)) {
        throw new Error("This email is already registered. Please sign in instead.");
      }
      if (form.phoneNumber && all.some((x) => x.phoneNumber === form.phoneNumber)) {
        throw new Error("This phone number is already registered.");
      }

      created = await api.createEmployee({
        empName: form.empName.trim(),
        designation: form.designation.trim(),
        gender: form.gender,
        address: form.address.trim(),
        email,
        phoneNumber: form.phoneNumber || null,
        deptId: form.deptId ? Number(form.deptId) : null,
        managerId: form.managerId ? Number(form.managerId) : null,
      });

      await api.createLogin(email, form.password, form.role);
      setDone({ email, empId: created.empId });
    } catch (err) {
      // Roll back the employee row if the login could not be created
      if (created) { try { await api.deleteEmployee(created.empId); } catch { /* ignore */ } }
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="row g-0 min-vh-100">
        <div className="col-lg-6 auth-hero d-none d-lg-flex">
          <span className="brand-logo mb-4">L</span>
          <h1 className="display-5 fw-bold">You're all set.</h1>
          <p className="fs-5 opacity-75">Sign in with your email and password.</p>
        </div>
        <div className="col-lg-6 auth-side d-flex align-items-center justify-content-center p-4">
          <div className="card auth-card p-4 text-center">
            <h2 className="h4">Account created 🎉</h2>
            <p className="text-secondary mb-1">Your User ID (username) is:</p>
            <div className="fs-5 fw-bold my-2" style={{ color: "#059669", wordBreak: "break-all" }}>{done.email}</div>
            <p className="text-secondary small">Employee number: {done.empId}. Log in with your email, password and role.</p>
            <button className="btn btn-primary w-100" onClick={() => navigate("/login")}>Go to sign in</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-0 min-vh-100">
      <div className="col-lg-5 auth-hero d-none d-lg-flex">
        <span className="brand-logo mb-4">L</span>
        <h1 className="display-5 fw-bold">Welcome to LeaveHub.</h1>
        <p className="fs-5 opacity-75">Create your account. Your email is your User ID.</p>
      </div>

      <div className="col-lg-7 auth-side d-flex align-items-center justify-content-center p-4">
        <form className="card p-4 w-100" style={{ maxWidth: 600 }} onSubmit={submit}>
          <div className="d-flex align-items-center gap-2 mb-3 fw-bold fs-4" style={{ color: "#064e3b" }}>
            <span className="brand-logo">L</span> LeaveHub
          </div>
          <h2 className="h4">Create your account</h2>
          <p className="text-secondary">Fill in your details, choose your role and set a password.</p>
          <Alert>{error}</Alert>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Full name</label>
              <input className="form-control" value={form.empName} onChange={set("empName")} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email (your User ID)</label>
              <input type="email" maxLength={50} className="form-control" value={form.email} onChange={set("email")} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone <span className="text-secondary fw-normal">(optional)</span></label>
              <input className="form-control" maxLength={10} value={form.phoneNumber} onChange={set("phoneNumber")} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Designation</label>
              <input className="form-control" value={form.designation} onChange={set("designation")} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Gender</label>
              <select className="form-select" value={form.gender} onChange={set("gender")}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Role</label>
              <select className="form-select" value={form.role} onChange={set("role")}>
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Reporting Manager</option>
                <option value="HR">HR / Admin</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Address</label>
              <input className="form-control" value={form.address} onChange={set("address")} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Department ID <span className="text-secondary fw-normal">(optional)</span></label>
              <input type="number" className="form-control" value={form.deptId} onChange={set("deptId")} />
            </div>
            <div className="col-md-8">
              <label className="form-label fw-semibold">Reporting manager <span className="text-secondary fw-normal">(optional)</span></label>
              <select className="form-select" value={form.managerId} onChange={set("managerId")}>
                <option value="">None</option>
                {people.map((p) => (
                  <option key={p.empId} value={p.empId}>{p.empName} ({p.email})</option>
                ))}
              </select>
              {mgrError && <div className="form-text text-danger">Could not load managers: {mgrError}</div>}
              {!mgrError && people.length === 0 && <div className="form-text">No reporting managers registered yet. Create a Reporting Manager account first.</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" className="form-control" value={form.password} onChange={set("password")} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Confirm password</label>
              <input type="password" className="form-control" value={form.confirm} onChange={set("confirm")} required />
            </div>
          </div>

          <button className="btn btn-primary w-100 mt-4" disabled={busy}>{busy ? "Creating..." : "Create account"}</button>
          <p className="text-center mt-3 mb-0"><Link to="/login">Back to sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
