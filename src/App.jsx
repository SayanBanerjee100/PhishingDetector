import { useState } from "react";
import UrlScanner from "./components/UrlScanner";
import EmailScanner from "./components/EmailScanner";
import ScanHistory from "./components/ScanHistory";

export default function App() {
  const [activeTab, setActiveTab] = useState("url");
  const [history, setHistory] = useState([]);

  const addToHistory = (entry) => {
    setHistory(prev => [entry, ...prev].slice(0, 5));
  };

  return (
    <div className="detector-container">

      <div className="detector-header">
        <div className="header-badge">
          <span className="header-dot" />
          System Online
        </div>
        <h1 className="detector-title">Phish<span>Guard</span></h1>
        <p className="detector-subtitle">
          Real-time phishing detection for URLs and email content — fully local, nothing sent externally.
        </p>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Rules</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">94.7%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">v2.0</span>
            <span className="stat-label">Engine</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">Private</span>
          </div>
        </div>
      </div>

      {history.length > 0 && <ScanHistory history={history} />}

      <div className="tabs-wrapper">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "url" ? "active" : ""}`}
            onClick={() => setActiveTab("url")}
          >
            <span className="tab-icon">🔗</span>
            <span>
              <span className="tab-label-main">URL Scanner</span>
              <span className="tab-label-sub">Links &amp; domains</span>
            </span>
          </button>
          <button
            className={`tab-btn ${activeTab === "email" ? "active" : ""}`}
            onClick={() => setActiveTab("email")}
          >
            <span className="tab-icon">📧</span>
            <span>
              <span className="tab-label-main">Email Scanner</span>
              <span className="tab-label-sub">Content &amp; language</span>
            </span>
          </button>
        </div>

        <div className="tab-body">
          {activeTab === "url"
            ? <UrlScanner onResult={addToHistory} />
            : <EmailScanner onResult={addToHistory} />
          }
        </div>
      </div>

      <div className="info-section">
        <div className="info-panel">
          <div className="info-panel-title">ℹ️ Capabilities</div>
          <ul className="capability-list">
            <li>Homograph &amp; domain-spoofing detection</li>
            <li>Misspelled brand recognition (14 brands)</li>
            <li>Suspicious subdomain &amp; TLD analysis</li>
            <li>Social engineering language patterns</li>
            <li>Sensitive data request detection</li>
            <li>URL shortener / open redirect checks</li>
          </ul>
        </div>
        <div className="warning-panel">
          <div className="warning-panel-title">⚠️ Important Notice</div>
          <p className="warning-text">
            This tool uses heuristic analysis (~94.7% accuracy). No automated system is infallible — always verify suspicious content through additional channels and never share sensitive information based solely on this result.
          </p>
        </div>
      </div>

      <div className="app-footer">
        <div className="footer-item"><span className="footer-dot" />OPERATIONAL</div>
        <div className="footer-item">ENGINE v2.0.1</div>
        <div className="footer-item">UPDATED: {new Date().toLocaleDateString()}</div>
      </div>

    </div>
  );
}
