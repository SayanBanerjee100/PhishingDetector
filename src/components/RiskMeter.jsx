export default function RiskMeter({ score }) {
  let color = "green";
  let label = "Safe";

  if (score > 30 && score <= 60) {
    color = "orange";
    label = "Suspicious";
  } else if (score > 60) {
    color = "red";
    label = "High Risk";
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <h3 style={{ color }}>
        Risk Level: {label} ({score}%)
      </h3>
    </div>
  );
}
