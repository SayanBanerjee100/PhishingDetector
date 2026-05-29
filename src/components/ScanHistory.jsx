export default function ScanHistory({ history }) {
  const getClass = (score) => {
    if (score <= 20) return "safe";
    if (score <= 40) return "low";
    if (score <= 70) return "medium";
    return "critical";
  };

  return (
    <div className="history-strip">
      <div className="history-title">⏱ Recent Scans</div>
      <div className="history-list">
        {history.map((item, i) => (
          <div className="history-item" key={i}>
            <span className="history-type-badge">{item.type}</span>
            <span className="history-text">{item.input}</span>
            <span className={`history-score ${getClass(item.score)}`}>{item.score}</span>
            <span className="history-time">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
