import { useState, useEffect, useRef } from "react";
import { analyzeUrl } from "../utils/urlRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

const STEPS = [
  "Resolving domain structure…",
  "Checking for brand impersonation…",
  "Analyzing TLD & subdomain patterns…",
  "Scanning for homograph attacks…",
  "Evaluating URL entropy & structure…",
  "Cross-referencing threat indicators…",
];

export default function UrlScanner({ onResult }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef(null);

  const startScan = () => {
    if (!url.trim()) return;
    setIsScanning(true);
    setResult(null);
    setStepIndex(0);

    intervalRef.current = setInterval(() => {
      setStepIndex(prev => Math.min(prev + 1, STEPS.length - 1));
    }, 220);

    setTimeout(() => {
      clearInterval(intervalRef.current);
      let urlToScan = url.trim();
      if (!urlToScan.startsWith("http://") && !urlToScan.startsWith("https://")) {
        urlToScan = "https://" + urlToScan;
      }
      const res = analyzeUrl(urlToScan);
      setResult(res);
      setIsScanning(false);
      onResult({ type: "URL", input: url.trim(), score: res.score, time: new Date().toLocaleTimeString() });
    }, 1600);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const clear = () => { setUrl(""); setResult(null); };

  return (
    <div>
      <label className="input-label" htmlFor="url-input">Enter URL to scan</label>
      <input
        id="url-input"
        type="text"
        placeholder="https://example.com or paste any link…"
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => e.key === "Enter" && startScan()}
        className="detector-input"
        disabled={isScanning}
        autoComplete="off"
        spellCheck={false}
      />
      <p className="hint-text">Press Enter to scan quickly</p>

      <div className="btn-row">
        <button onClick={startScan} className="detector-button" disabled={isScanning || !url.trim()}>
          {isScanning ? <><span className="scan-spinner" style={spinnerStyle} />Scanning…</> : <>🔍 Scan URL</>}
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
