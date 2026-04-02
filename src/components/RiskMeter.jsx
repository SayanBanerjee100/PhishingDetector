export default function RiskMeter({ score }) {
  let riskClass = "safe";
  let label = "SAFE";
  let emoji = "✅";
  let description = "Neural networks confirm this resource appears legitimate";
  let color = "#00ff41";

  if (score > 20 && score <= 40) {
    riskClass = "low";
    label = "LOW RISK";
    emoji = "⚠️";
    description = "Minor anomalies detected - maintain security protocols";
    color = "#ffaa00";
  } else if (score > 40 && score <= 70) {
    riskClass = "medium";
    label = "MEDIUM RISK";
    emoji = "⚠️";
    description = "Multiple threat indicators detected - high alert status";
    color = "#ff8800";
  } else if (score > 70) {
    riskClass = "critical";
    label = "CRITICAL THREAT";
    emoji = "🚨";
    description = "SEVERE MALICIOUS INDICATORS - IMMEDIATE ACTION REQUIRED";
    color = "#ff4444";
  }

  return (
    <div className={`risk-meter ${riskClass}`}>
      <h3 style={{ color, margin: "0 0 8px 0", textShadow: `0 0 5px ${color}` }}>
        {emoji} THREAT LEVEL: {label} ({score}%)
      </h3>
      <p style={{ margin: "0 0 15px 0", color: "#ccc", fontSize: "14px" }}>
        {description}
      </p>
      <div className="risk-bar">
        <div
          className="risk-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}, ${score > 70 ? '#ff0000' : score > 40 ? '#ff8800' : '#00ff41'})`
          }}
        />
      </div>
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
        Confidence: {100 - score}% | Algorithm: Neural Pattern Recognition v2.0
      </div>
    </div>
  );
}
