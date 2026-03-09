import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  return (
    <div className="landing-center-wrap">
      <div className="landing-card">
        <div className="landing-badge">
          <span className="landing-badge__dot" />
          <span>Local AI coding assistant</span>
        </div>

        <h1 className="landing-title">Welcome to Nexora</h1>

        <p className="landing-description">
          Nexora is a local AI coding assistant. It runs directly on{" "}
          <span className="mono">Ollama</span> models on your computer — with no
          cloud API calls and no code sent to third-party services.
        </p>

        <div className="landing-info-grid">
          <div className="landing-info-block">
            <h2 className="landing-info-title">What does Nexora do?</h2>
            <ul className="landing-list">
              <li>Explains your code (JS, TS, React, Node...)</li>
              <li>Finds bugs and suggests fixes</li>
              <li>Refactors and cleans up components and functions</li>
            </ul>
          </div>

          <div className="landing-info-block">
            <h2 className="landing-info-title">Why is it different?</h2>
            <ul className="landing-list">
              <li>Runs entirely locally on your computer</li>
              <li>No code is sent to the cloud or external services</li>
              <li>A simple interface focused on code</li>
            </ul>
          </div>
        </div>

        <div className="landing-divider" />

        <div className="landing-actions-row">
          <Link to="/login" className="primary-btn landing-action-btn">
            Login
          </Link>

          <Link to="/register" className="secondary-btn landing-action-btn">
            Register
          </Link>

          <span className="landing-actions-note">
            After logging in, the Nexora chat interface will open.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Landing;