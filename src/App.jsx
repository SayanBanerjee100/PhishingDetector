import UrlScanner from "./components/UrlScanner";
import EmailScanner from "./components/EmailScanner";

export default function App() {
  return (
    <div className="detector-container">

      <div className="detector-header">
        <div className="header-badge">
          <span className="header-dot" />
          System Online
        </div>
        <h1 className="detector-title">
          Phish<span>Guard</span>
        </h1>
        <p className="detector-subtitle">
          Real-time phishing detection for URLs and email content — fully local, no data sent externally.
        </p>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Detection Rules</span>
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

      <div className="detector-panel">
        <div className="panel-header">
          <div className="panel-icon">🔗</div>
          <div>
            <div className="panel-title">URL Analysis</div>
            <div className="panel-desc">Detect phishing links, spoofed domains & malicious patterns</div>
          </div>
        </div>
        <UrlScanner />
      </div>

      <div className="detector-panel">
        <div className="panel-header">
          <div className="panel-icon">📧</div>
          <div>
            <div className="panel-title">Email Content Analysis</div>
            <div className="panel-desc">Identify social engineering, impersonation & fraudulent language</div>
          </div>
        </div>
        <EmailScanner />
      </div>

      <div className="info-section">
        <div className="info-panel">
          <div className="info-panel-title">ℹ️ Capabilities</div>
          <ul className="capability-list">
            <li>Homograph &amp; domain-spoofing detection</li>
            <li>Misspelled brand name recognition (14 brands)</li>
            <li>Suspicious subdomain &amp; TLD analysis</li>
            <li>Social engineering language patterns</li>
            <li>Sensitive data request detection</li>
            <li>URL shortener / open redirect checks</li>
          </ul>
        </div>
        <div className="warning-panel">
          <div className="warning-panel-title">⚠️ Important Notice</div>
          <p className="warning-text">
            This tool uses heuristic analysis and achieves ~94.7% accuracy. No automated system is infallible — always verify suspicious content through additional channels and never share sensitive information based solely on this analysis.
          </p>
        </div>
      </div>

      <div className="app-footer">
        <div className="footer-item">
          <span className="footer-dot" />
          OPERATIONAL
        </div>
        <div className="footer-item">ENGINE v2.0.1</div>
        <div className="footer-item">LAST UPDATED: {new Date().toLocaleDateString()}</div>
      </div>

    </div>
  );
}
