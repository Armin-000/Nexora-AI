import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/privacypolicy.css";

const PrivacyPolicy: React.FC = () => {
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
    <div className="legal-page legal-page--privacy">
      <div className="legal-page__background" />

      <div className="legal-shell">
        <header className="topbar">
          <div className="topbar-main">
            <div className="topbar-title">NEXORA</div>
            <div className="topbar-subtitle">
              <span className="sub-label">Privacy Policy</span>
              <span className="mono sub-model">Data & Privacy</span>
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
              Privacy & Data Handling
            </div>

            <h1 className="legal-title">Privacy Policy</h1>

            <p className="legal-lead">
              This privacy policy explains how Nexora may process, store and
              protect user information. Replace this placeholder content with
              your real implementation details before public release.
            </p>

            <div className="legal-stack">
              <article className="legal-section">
                <h2 className="legal-section__title">1. General Information</h2>
                <p>
                  Nexora is designed as a local AI coding assistant. Depending
                  on deployment, prompts and code may remain entirely on the
                  user’s device.
                </p>
              </article>

              <article className="legal-section">
                <h2 className="legal-section__title">2. Data We May Process</h2>
                <p>Account data such as username or email address.</p>
                <p>Technical logs required for authentication and security.</p>
                <p>Optional usage metadata if explicitly implemented.</p>
              </article>

              <article className="legal-section">
                <h2 className="legal-section__title">3. Purpose of Processing</h2>
                <p>To provide access to the application.</p>
                <p>To maintain security, stability and system integrity.</p>
                <p>To improve product functionality where applicable.</p>
              </article>

              <article className="legal-section">
                <h2 className="legal-section__title">4. Local Processing Notice</h2>
                <p>
                  If Nexora runs fully locally with Ollama, prompts, code and
                  generated responses may stay on the local machine and may not
                  be transferred to third-party cloud providers.
                </p>
              </article>

              <article className="legal-section">
                <h2 className="legal-section__title">5. Contact</h2>
                <p>For privacy questions, contact: contact@nexora.local</p>
              </article>
            </div>

            <div className="legal-note legal-note--privacy">
              Important: this is a UI-ready template, not final legal advice.
              You should adapt it to your real authentication flow, backend,
              deployment, cookies, analytics and local law.
            </div>

            <div className="legal-actions">
              <Link to={backHref} className="legal-button legal-button--primary">
                {backLabel}
              </Link>

              <Link
                to="/impressum"
                state={{ from: backHref }}
                className="legal-button legal-button--secondary"
              >
                Open Impressum
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;