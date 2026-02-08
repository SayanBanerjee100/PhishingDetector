import UrlScanner from "./components/UrlScanner";
import EmailScanner from "./components/EmailScanner";

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🛡️ Phishing Detection Tool</h1>

      <hr />
      <UrlScanner />

      <hr />
      <EmailScanner />

      <hr />
      <p style={{ fontSize: "12px", color: "gray" }}>
        Disclaimer: This tool uses heuristic analysis and does not guarantee
        100% accuracy.
      </p>
    </div>
  );
}
