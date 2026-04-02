import { useState } from "react";
import { analyzeUrl } from "../utils/urlRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

export default function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanUrl = async () => {
    if (!url.trim()) {
      alert("Please enter a URL to scan");
      return;
    }

    setIsScanning(true);

    // Simulate scanning delay for dramatic effect
    setTimeout(() => {
      let urlToScan = url.trim();
      // Auto-add https:// if no protocol specified
      if (!urlToScan.startsWith("http://") && !urlToScan.startsWith("https://")) {
        urlToScan = "https://" + urlToScan;
      }

      setResult(analyzeUrl(urlToScan));
      setIsScanning(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      scanUrl();
    }
  };

  const clearResults = () => {
    setUrl("");
    setResult(null);
    setIsScanning(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="ENTER URL FOR ANALYSIS..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyPress={handleKeyPress}
        className="detector-input"
        disabled={isScanning}
      />
      <br /><br />
      <button
        onClick={scanUrl}
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
          🔍 SCANNING NEURAL NETWORKS... <br />
          ANALYZING PATTERNS... DETECTING ANOMALIES...
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
