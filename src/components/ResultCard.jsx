export default function ResultCard({ reasons }) {
  return (
    <div>
      <h4>Detection Details:</h4>
      <ul>
        {reasons.map((r, i) => (
          <li key={i}>⚠️ {r}</li>
        ))}
      </ul>
    </div>
  );
}
