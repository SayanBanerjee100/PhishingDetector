import { useState } from "react";
import { analyzeUrl } from "../utils/urlRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

export default function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const scanUrl = () => {
    setResult(analyzeUrl(url));
  };

  return (
    <div>
      <h2>🔗 Phishing Link Detector</h2>
      <input
        type="text"
        placeholder="Paste URL here"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "80%" }}
      />
      <br /><br />
      <button onClick={scanUrl}>Scan URL</button>

      {result && (
        <>
          <RiskMeter score={result.score} />
          <ResultCard reasons={result.reasons} />
        </>
      )}
    </div>
  );
}
