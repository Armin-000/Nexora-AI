import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import LandingWaveCanvas from "./LandingWaveCanvas";

const AuthLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="app-root theme-light">
      <div className="chat-shell landing-shell">
        <div className="landing-canvas-wrap" aria-hidden="true">
          <LandingWaveCanvas />
        </div>

        <div className="landing-overlay" />

        <header className="topbar">
          <div className="topbar-main">
            <div className="topbar-title">NEXORA</div>
            <div className="topbar-subtitle">
              <span className="sub-label">AI Chatbot</span>
              <span className="mono sub-model">Local • Private • Fast</span>
            </div>
          </div>
        </header>

        <main className="chat-body landing-content">
          <Outlet />
        </main>

        <div className="landing-legal-bar" aria-label="Legal links">
          <Link
            to="/impressum"
            state={{ from: location.pathname }}
            className="landing-legal-link"
            aria-label="Impressum"
            title="Impressum"
          >
            <svg
              className="landing-legal-link__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 3H14L19 8V19C19 20.1046 18.1046 21 17 21H8C6.89543 21 6 20.1046 6 19V5C6 3.89543 6.89543 3 8 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 3V8H19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12H15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M9 16H13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          <Link
            to="/privacy-policy"
            state={{ from: location.pathname }}
            className="landing-legal-link"
            aria-label="Privacy Policy"
            title="Privacy Policy"
          >
            <svg
              className="landing-legal-link__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 3L19 6V11C19 15.4183 16.134 19.2167 12 21C7.866 19.2167 5 15.4183 5 11V6L12 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 12L11.2 13.7L14.8 10.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;