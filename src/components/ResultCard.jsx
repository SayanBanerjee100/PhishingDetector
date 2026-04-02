export default function ResultCard({ reasons }) {
  return (
    <div style={{
      marginTop: "20px",
      padding: "20px",
      background: "rgba(0, 0, 0, 0.5)",
      border: "1px solid rgba(255, 165, 0, 0.5)",
      borderRadius: "8px",
      position: "relative"
    }}>
      <h4 style={{
        margin: "0 0 15px 0",
        color: "#ffaa00",
        textShadow: "0 0 5px #ffaa00",
        fontSize: "1.1em"
      }}>
        🔍 DETECTION LOG:
      </h4>
      <ul className="result-list">
        {reasons.map((r, i) => (
          <li key={i} className="result-item">
            <span>{r}</span>
          </li>
        ))}
      </ul>
      <div style={{
        marginTop: "15px",
        fontSize: "12px",
        color: "#888",
        borderTop: "1px solid rgba(255, 165, 0, 0.3)",
        paddingTop: "10px"
      }}>
        Analysis completed using {reasons.length} detection algorithms |
        Timestamp: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
