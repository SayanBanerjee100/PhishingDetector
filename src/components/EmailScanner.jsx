import { useState } from "react";
import { analyzeEmail } from "../utils/emailRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

export default function EmailScanner() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanEmail = () => {
    if (!emailText.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      setResult(analyzeEmail(emailText));
      setIsScanning(false);
    }, 1600);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") scanEmail();
  };

  const clearResults = () => {
    setEmailText("");
    setResult(null);
  };

  return (
    <div>
      <div className="input-wrapper">
        <label className="input-label" htmlFor="email-input">Paste Email Content</label>
        <textarea
          id="email-input"
          rows="7"
          placeholder="Paste the full email body or subject line here…"
          value={emailText}
          onChange={e => setEmailText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="detector-input"
          disabled={isScanning}
          style={{ minHeight: "120px" }}
        />
        <p className="hint-text">Tip: Ctrl + Enter to scan</p>
      </div>

      <div className="btn-row">
        <button onClick={scanEmail} className="detector-button" disabled={isScanning || !emailText.trim()}>
          {isScanning ? (
            <>
              <span className="scan-spinner" />
              Analyzing…
            </>
          ) : (
            <>🧠 Scan Email</>
          )}
        </button>
        {result && (
          <button onClick={clearResults} className="detector-button btn-secondary">
            Clear
          </button>
        )}
      </div>

      {isScanning && (
        <div className="scanning-animation">
          <span className="scan-spinner" />
          Analyzing language patterns and social engineering indicators…
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
