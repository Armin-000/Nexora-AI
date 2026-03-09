import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !confirm) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const resp = await res.json();

      if (!res.ok) {
        setError(resp.error);
        return;
      }

      setError(resp.message);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-center-wrap">
      <form onSubmit={handleSubmit} className="modal-form auth-glass-form">
        <h2
          style={{
            margin: 0,
            marginBottom: 12,
            fontSize: 18,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Registration
        </h2>

        <div className="form-group">
          <label className="field-label" htmlFor="reg-username">
            Username
          </label>
          <input
            id="reg-username"
            type="text"
            className="field-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="reg-confirm">
            Confirm Password
          </label>
          <input
            id="reg-confirm"
            type="password"
            className="field-input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter password"
          />
        </div>

        {error && (
          <div
            className={
              error.includes("successfully")
                ? "form-status form-status-success"
                : "form-status form-status-error"
            }
          >
            {error}
          </div>
        )}

        <div
          className="form-actions"
          style={{ justifyContent: "space-between", marginTop: "1.5rem" }}
        >
          <Link
            to="/"
            className="secondary-btn"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ← Back
          </Link>

          <button type="submit" className="primary-btn">
            Sign up
          </button>
        </div>

        <p className="field-hint" style={{ marginTop: 10, textAlign: "right" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;