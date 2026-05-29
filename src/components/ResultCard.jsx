export default function ResultCard({ reasons }) {
  const classify = (r) => {
    if (r.startsWith("🚨") || r.includes("CRITICAL")) return "critical";
    if (r.startsWith("⚠️") || r.startsWith("⚠")) return "warning";
    if (r.startsWith("🔗")) return "info";
    if (r.startsWith("✅")) return "safe";
    return "warning";
  };

  return (
    <div className="result-card">
      <div className="result-card-header">
        <span className="result-card-title">Detection Log</span>
        <span className="result-count">{reasons.length} finding{reasons.length !== 1 ? "s" : ""}</span>
      </div>

      <ul className="result-list">
        {reasons.map((r, i) => (
          <li key={i} className={`result-item ${classify(r)}`}>
            {r}
          </li>
        ))}
      </ul>

      <div className="result-footer">
        <span>{reasons.length} rule{reasons.length !== 1 ? "s" : ""} evaluated</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
