import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Alert } from "../components/ui.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await api.login(username.trim().toLowerCase(), password);

      // Backend login only returns username + role, so look up the employee profile by email
      const list = await api.employees();
      const me = list.find((x) => (x.email || "").toLowerCase() === res.username.toLowerCase());
      if (!me && (res.role === "EMPLOYEE" || res.role === "MANAGER")) {
        throw new Error("No employee profile found for this email.");
      }

      login({
        username: res.username,
        role: res.role,
        empId: me ? me.empId : null,
        name: me ? me.empName : null,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="row g-0 min-vh-100">
      <div className="col-lg-6 auth-hero d-none d-lg-flex">
        <span className="brand-logo mb-4">L</span>
        <h1 className="display-5 fw-bold">Manage leave, effortlessly.</h1>
        <p className="fs-5 opacity-75">Apply, approve and track leave in one place.</p>
      </div>

      <div className="col-lg-6 auth-side d-flex align-items-center justify-content-center p-4">
        <form className="card auth-card p-4" onSubmit={submit}>
          <div className="d-flex align-items-center gap-2 mb-3 fw-bold fs-4" style={{ color: "#064e3b" }}>
            <span className="brand-logo">L</span> LeaveHub
          </div>
          <h2 className="h4">Welcome back</h2>
          <p className="text-secondary">Sign in with your email and password.</p>
          <Alert>{error}</Alert>

          <div className="mb-3">
            <label className="form-label fw-semibold">Username (email)</label>
            <input type="email" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@company.com" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button className="btn btn-primary w-100" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
          <p className="text-center text-secondary mt-3 mb-0">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
