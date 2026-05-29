import { useState, useEffect, useRef } from "react";
import { analyzeEmail } from "../utils/emailRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

const STEPS = [
  "Parsing email structure…",
  "Scanning for urgency language patterns…",
  "Checking for impersonation signals…",
  "Detecting sensitive data requests…",
  "Analyzing reward & threat language…",
  "Evaluating social engineering indicators…",
];

export default function EmailScanner({ onResult }) {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef(null);

  const startScan = () => {
    if (!emailText.trim()) return;
    setIsScanning(true);
    setResult(null);
    setStepIndex(0);

    intervalRef.current = setInterval(() => {
      setStepIndex(prev => Math.min(prev + 1, STEPS.length - 1));
    }, 260);

    setTimeout(() => {
      clearInterval(intervalRef.current);
      const res = analyzeEmail(emailText);
      setResult(res);
      setIsScanning(false);
      const preview = emailText.trim().slice(0, 48) + (emailText.length > 48 ? "…" : "");
      onResult({ type: "EMAIL", input: preview, score: res.score, time: new Date().toLocaleTimeString() });
    }, 1900);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const clear = () => { setEmailText(""); setResult(null); };

  return (
    <div>
      <label className="input-label" htmlFor="email-input">Paste email content</label>
      <textarea
        id="email-input"
        rows={7}
        placeholder="Paste the full email body or subject line here…"
        value={emailText}
        onChange={e => setEmailText(e.target.value)}
        onKeyDown={e => e.ctrlKey && e.key === "Enter" && startScan()}
        className="detector-input"
        disabled={isScanning}
        style={{ minHeight: 120 }}
      />
      <p className="hint-text">Ctrl + Enter to scan quickly</p>

      <div className="btn-row">
        <button onClick={startScan} className="detector-button" disabled={isScanning || !emailText.trim()}>
          {isScanning ? <><span className="scan-spinner" style={spinnerStyle} />Scanning…</> : <>🧠 Scan Email</>}
        </button>
        {result && !isScanning && (
          <button onClick={clear} className="detector-button btn-secondary">Clear</button>
        )}
      </div>

      {isScanning && (
        <div className="scan-steps">
          <ul className="scan-steps-list">
            {STEPS.map((step, i) => (
              <li key={i} className={`scan-step ${i < stepIndex ? "done" : i === stepIndex ? "active" : ""}`}>
                <span className="step-icon">{i < stepIndex ? "✓" : i === stepIndex ? "●" : i + 1}</span>
                {step}
              </li>
            ))}
          </ul>
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

const spinnerStyle = {
  display: "inline-block", width: 14, height: 14,
  border: "2px solid rgba(0,0,0,0.25)", borderTopColor: "#0d1117",
  borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0
};
