import { useState } from "react";
import { analyzeEmail } from "../utils/emailRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

export default function EmailScanner() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanEmail = async () => {
    if (!emailText.trim()) {
      alert("Please paste email content to scan");
      return;
    }

    setIsScanning(true);

    // Simulate scanning delay for dramatic effect
    setTimeout(() => {
      setResult(analyzeEmail(emailText));
      setIsScanning(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      scanEmail();
    }
  };

  const clearResults = () => {
    setEmailText("");
    setResult(null);
    setIsScanning(false);
  };

  return (
    <div>
      <textarea
        rows="8"
        placeholder="PASTE EMAIL CONTENT FOR NEURAL ANALYSIS..."
        value={emailText}
        onChange={e => setEmailText(e.target.value)}
        onKeyPress={handleKeyPress}
        className="detector-input"
        disabled={isScanning}
        style={{ resize: "vertical", minHeight: "120px" }}
      />
      <br /><br />
      <p style={{ fontSize: "12px", color: "#00cc33", margin: "5px 0 10px 0", opacity: 0.8 }}>
        💡 HOTKEY: Ctrl+Enter to initiate scan
      </p>
      <button
        onClick={scanEmail}
        className="detector-button"
        disabled={isScanning}
      >
        {isScanning ? "ANALYZING..." : "INITIATE SCAN"}
      </button>
      {result && (
        <button
          onClick={clearResults}
          className="detector-button"
          style={{ background: "linear-gradient(45deg, #666, #999)" }}
        >
          CLEAR DATA
        </button>
      )}

      {isScanning && (
        <div className="scanning-animation">
          🧠 PROCESSING NEURAL NETWORKS... <br />
          ANALYZING LANGUAGE PATTERNS... DETECTING SOCIAL ENGINEERING...
        </div>
      )}

      {result && !isScanning && (
        <>
          <RiskMeter score={result.score} />
          <ResultCard reasons={result.reasons} />
        </>
      )}
    </div>
  );
}
