import { useState } from "react";
import { analyzeEmail } from "../utils/emailRules";
import RiskMeter from "./RiskMeter";
import ResultCard from "./ResultCard";

export default function EmailScanner() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);

  const scanEmail = () => {
    setResult(analyzeEmail(emailText));
  };

  return (
    <div>
      <h2>📧 Phishing Email Detector</h2>
      <textarea
        rows="6"
        placeholder="Paste email content here"
        value={emailText}
        onChange={e => setEmailText(e.target.value)}
        style={{ width: "80%" }}
      />
      <br /><br />
      <button onClick={scanEmail}>Scan Email</button>

      {result && (
        <>
          <RiskMeter score={result.score} />
          <ResultCard reasons={result.reasons} />
        </>
      )}
    </div>
  );
}
