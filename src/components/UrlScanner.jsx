import { useState } from "react";
import { analyzeUrl } from "../utils/urlRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

export default function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanUrl = () => {
    if (!url.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      let urlToScan = url.trim();
      if (!urlToScan.startsWith("http://") && !urlToScan.startsWith("https://")) {
        urlToScan = "https://" + urlToScan;
      }
      setResult(analyzeUrl(urlToScan));
      setIsScanning(false);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") scanUrl();
  };

  const clearResults = () => {
    setUrl("");
    setResult(null);
  };

  return (
    <div>
      <div className="input-wrapper">
        <label className="input-label" htmlFor="url-input">Enter URL</label>
        <input
          id="url-input"
          type="text"
          placeholder="https://example.com or paste any link..."
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          className="detector-input"
          disabled={isScanning}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="hint-text">Tip: Press Enter to scan quickly</p>
      </div>

      <div className="btn-row">
        <button onClick={scanUrl} className="detector-button" disabled={isScanning || !url.trim()}>
          {isScanning ? (
            <>
              <span className="scan-spinner" />
              Analyzing…
            </>
          ) : (
            <>🔍 Scan URL</>
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
          Scanning domain patterns and threat indicators…
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
