export default function RiskMeter({ score }) {
  let color = "green";
  let label = "Safe";
  let bgColor = "#d4edda";
  let emoji = "✅";
  let description = "This appears to be a legitimate resource";

  if (score > 20 && score <= 40) {
    color = "#ff9800";
    label = "Low Risk";
    bgColor = "#fff3cd";
    emoji = "⚠️";
    description = "Minor phishing indicators detected - exercise caution";
  } else if (score > 40 && score <= 70) {
    color = "#ff5722";
    label = "Medium Risk";
    bgColor = "#ffe5b4";
    emoji = "⚠️";
    description = "Multiple phishing indicators detected - likely malicious";
  } else if (score > 70) {
    color = "darkred";
    label = "CRITICAL RISK";
    bgColor = "#f8d7da";
    emoji = "🚨";
    description = "Strong phishing/fraud indicators - AVOID at all costs!";
  }

  return (
    <div style={{
      marginTop: "15px",
      padding: "15px",
      backgroundColor: bgColor,
      borderLeft: `5px solid ${color}`,
      borderRadius: "5px"
    }}>
      <h3 style={{ color, margin: "0 0 8px 0" }}>
        {emoji} Risk Level: {label} ({score}%)
      </h3>
      <p style={{ margin: "0", color: "#333", fontSize: "14px" }}>
        {description}
      </p>
      <div style={{ marginTop: "10px", height: "8px", backgroundColor: "#ddd", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{
          width: `${score}%`,
          height: "100%",
          backgroundColor: color,
          transition: "width 0.3s ease"
        }} />
      </div>
    </div>
  );
}
