export default function RiskMeter({ score }) {
  let riskClass = "safe";
  let label = "Safe";
  let description = "No significant phishing indicators detected.";

  if (score > 20 && score <= 40) {
    riskClass = "low";
    label = "Low Risk";
    description = "Minor anomalies found — review the details below.";
  } else if (score > 40 && score <= 70) {
    riskClass = "medium";
    label = "Medium Risk";
    description = "Multiple threat indicators detected — exercise caution.";
  } else if (score > 70) {
    riskClass = "critical";
    label = "Critical Threat";
    description = "Severe phishing indicators found — do not interact with this content.";
  }

  return (
    <div className="risk-meter">
      <div className="risk-header">
        <div>
          <div className={`risk-badge ${riskClass}`}>
            {riskClass === "safe" && "✓ "}
            {riskClass === "low" && "⚠ "}
            {riskClass === "medium" && "⚠ "}
            {riskClass === "critical" && "✕ "}
            {label}
          </div>
          <p className="risk-description" style={{ marginTop: "8px" }}>{description}</p>
        </div>
        <div className={`risk-score ${riskClass}`}>{score}<span style={{ fontSize: "1rem", opacity: 0.6 }}>/100</span></div>
      </div>

      <div className="risk-bar-track">
        <div
          className={`risk-bar-fill ${riskClass}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="risk-footer">
        <span>THREAT SCORE: {score}%</span>
        <span>ENGINE: Neural Pattern Recognition v2.0</span>
      </div>
    </div>
  );
}
