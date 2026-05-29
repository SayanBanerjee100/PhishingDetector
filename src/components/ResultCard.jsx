import { useState } from "react";

const classify = (r) => {
  if (r.startsWith("🚨") || r.includes("CRITICAL")) return "critical";
  if (r.startsWith("✅")) return "safe";
  if (r.startsWith("🔗")) return "info";
  return "warning";
};

export default function ResultCard({ reasons }) {
  const [copied, setCopied] = useState(false);

  const groups = {
    critical: reasons.filter(r => classify(r) === "critical"),
    warning:  reasons.filter(r => classify(r) === "warning"),
    info:     reasons.filter(r => classify(r) === "info"),
    safe:     reasons.filter(r => classify(r) === "safe"),
  };

  const handleCopy = () => {
    const text = [
      "=== PhishGuard Detection Report ===",
      `Scanned: ${new Date().toLocaleString()}`,
      "",
      ...Object.entries(groups)
        .filter(([, items]) => items.length > 0)
        .flatMap(([label, items]) => [
          `[ ${label.toUpperCase()} ]`,
          ...items.map(i => `  • ${i}`),
          ""
        ])
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const counts = {
    critical: groups.critical.length,
    warning:  groups.warning.length,
    info:     groups.info.length,
    safe:     groups.safe.length,
  };

  return (
    <div className="result-card">

      <div className="result-card-header">
        <span className="result-card-title">Detection Log</span>
        <div className="result-header-right">
          <span className="result-count">{reasons.length} finding{reasons.length !== 1 ? "s" : ""}</span>
          <button onClick={handleCopy} className={`copy-btn ${copied ? "copied" : ""}`}>
            {copied ? "✓ Copied" : "⎘ Copy Report"}
          </button>
        </div>
      </div>

      <div className="threat-chart">
        {counts.critical > 0 && (
          <div className="chart-bar-item">
            <span className="chart-dot critical" />
            {counts.critical} Critical
          </div>
        )}
        {counts.warning > 0 && (
          <div className="chart-bar-item">
            <span className="chart-dot warning" />
            {counts.warning} Warning
          </div>
        )}
        {counts.info > 0 && (
          <div className="chart-bar-item">
            <span className="chart-dot info" />
            {counts.info} Info
          </div>
        )}
        {counts.safe > 0 && (
          <div className="chart-bar-item">
            <span className="chart-dot safe" />
            {counts.safe} Safe
          </div>
        )}
      </div>

      {["critical","warning","info","safe"].map(group => (
        groups[group].length > 0 && (
          <div className="result-group" key={group}>
            <div className="result-group-label">{group}</div>
            <ul className="result-list">
              {groups[group].map((r, i) => (
                <li key={i} className={`result-item ${group}`}
                  style={{ animationDelay: `${i * 40}ms` }}>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )
      ))}

      <div className="result-footer">
        <span>{reasons.length} rule{reasons.length !== 1 ? "s" : ""} evaluated</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
