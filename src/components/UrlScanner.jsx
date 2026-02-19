import { useState } from "react";
import { analyzeUrl } from "../utils/urlRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

export default function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const scanUrl = () => {
    if (!url.trim()) {
      alert("Please enter a URL to scan");
      return;
    }
    
    let urlToScan = url.trim();
    // Auto-add https:// if no protocol specified
    if (!urlToScan.startsWith("http://") && !urlToScan.startsWith("https://")) {
      urlToScan = "https://" + urlToScan;
    }
    
    setResult(analyzeUrl(urlToScan));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      scanUrl();
    }
  };

  const clearResults = () => {
    setUrl("");
    setResult(null);
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>🔗 Phishing Link Detector</h2>
      <input
        type="text"
        placeholder="Paste URL here (e.g., https://example.com or example.com)"
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          width: "80%",
          padding: "10px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc"
        }}
      />
      <br /><br />
      <button
        onClick={scanUrl}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "10px",
          fontSize: "14px"
        }}
      >
        🔍 Scan URL
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
