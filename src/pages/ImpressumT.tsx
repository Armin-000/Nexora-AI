import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/impressum.css";

const Impressum: React.FC = () => {
  const location = useLocation();
  const backHref = location.state?.from || "/";

  const backLabel =
    backHref === "/chat"
      ? "Back to Chat"
      : backHref === "/login"
      ? "Back to Login"
      : backHref === "/register"
      ? "Back to Register"
      : "Back to Landing";
  return (
    <div className="legal-page legal-page--impressum">
      <div className="legal-page__background" />

      <div className="legal-shell">
        <header className="topbar">
          <div className="topbar-main">
            <div className="topbar-title">NEXORA</div>
            <div className="topbar-subtitle">
              <span className="sub-label">Impressum</span>
              <span className="mono sub-model">Legal Information</span>
            </div>
          </div>
        </header>

        <main className="legal-main">
          <section className="legal-card">
            <div className="legal-badge">
              <svg
                className="legal-badge__icon"
                viewBox="0 0 24 24"
                fill="none"
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
              Legal Information
            </div>

            <h1 className="legal-title">Impressum</h1>

            <p className="legal-lead">
              This page contains provider and contact information for Nexora.
              Replace the placeholder content below with your real legal and
              contact information before publishing publicly.
            </p>

            <div className="legal-grid">
              <article className="legal-section">
                <h2 className="legal-section__title">Project Name</h2>
                <p>Nexora</p>
              </article>

              <article className="legal-section">
                <h2 className="legal-section__title">Responsible Person</h2>
                <p>Armin Ališić</p>
              </article>

              <article className="legal-section">
                <h2 className="legal-section__title">Address</h2>
                <p>Example Street 12</p>
                <p>51000 Rijeka</p>
                <p>Croatia</p>
              </article>

              <article className="legal-section">
                <h2 className="legal-section__title">Contact</h2>
                <p>Email: contact@nexora.local</p>
                <p>Phone: +385 99 000 0000</p>
              </article>

              <article className="legal-section legal-section--full">
                <h2 className="legal-section__title">About This Website</h2>
                <p>
                  Nexora is a local AI coding assistant focused on private,
                  local-first development workflows powered by local models.
                </p>
              </article>
            </div>

            <div className="legal-note">
              Important: adapt this page to the legal requirements that apply to
              your country, project type, and deployment model.
            </div>

            <div className="legal-actions">
              <Link to={backHref} className="legal-button legal-button--primary">
                {backLabel}
              </Link>

              <Link
                to="/privacy-policy"
                state={{ from: backHref }}
                className="legal-button legal-button--secondary"
              >
                Open Privacy Policy
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Impressum;