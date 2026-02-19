import { useState } from "react";
import { analyzeEmail } from "../utils/emailRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

export default function EmailScanner() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);

  const scanEmail = () => {
    if (!emailText.trim()) {
      alert("Please paste email content to scan");
      return;
    }
    setResult(analyzeEmail(emailText));
  };

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      scanEmail();
    }
  };

  const clearResults = () => {
    setEmailText("");
    setResult(null);
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>📧 Phishing Email Detector</h2>
      <textarea
        rows="8"
        placeholder="Paste email content here (subject, sender, body, etc.)"
        value={emailText}
        onChange={e => setEmailText(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          width: "80%",
          padding: "10px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontFamily: "Arial, sans-serif"
        }}
      />
      <br /><br />
      <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 10px 0" }}>
        💡 Tip: Ctrl+Enter to scan
      </p>
      <button
        onClick={scanEmail}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "10px",
          fontSize: "14px"
        }}
      >
        🔍 Scan Email
      </button>
      {result && (
        <button
          onClick={clearResults}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Clear
        </button>
      )}

      {result && (
        <>
          <RiskMeter score={result.score} />
          <ResultCard reasons={result.reasons} />
        </>
      )}
    </div>
  );
}
