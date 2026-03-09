import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    const detectDeviceType = () => {
      const ua = navigator.userAgent.toLowerCase();

      if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua)) {
        return "mobile";
      }

      if (/ipad|tablet|android(?!.*mobile)/.test(ua)) {
        return "tablet";
      }

      return "desktop";
    };

    const device_type = detectDeviceType();

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          device_type,
          status: "active",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      login(data.token);

      navigate("/chat");
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
          Login
        </h2>

        <div className="form-group">
          <label className="field-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        {error && <div className="form-status form-status-error">{error}</div>}

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
            Sign in
          </button>
        </div>

        <p className="field-hint" style={{ marginTop: 10, textAlign: "right" }}>
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;