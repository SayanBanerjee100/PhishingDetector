export default function ResultCard({ reasons }) {
  return (
    <div style={{
      marginTop: "15px",
      padding: "15px",
      backgroundColor: "#f5f5f5",
      borderRadius: "5px",
      border: "1px solid #ddd"
    }}>
      <h4 style={{ margin: "0 0 12px 0", color: "#333" }}>🔍 Detection Details:</h4>
      <ul style={{
        margin: "0",
        paddingLeft: "20px",
        listStyleType: "none"
      }}>
        {reasons.map((r, i) => (
          <li key={i} style={{
            marginBottom: "8px",
            padding: "8px",
            backgroundColor: "#fff",
            borderRadius: "4px",
            borderLeft: "3px solid #ff9800",
            fontSize: "14px",
            color: "#333"
          }}>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
