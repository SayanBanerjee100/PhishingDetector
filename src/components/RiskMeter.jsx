import { useState, useEffect } from "react";

export default function RiskMeter({ score }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);
    let current = 0;
    const step = Math.ceil(score / 30);
    const timer = setInterval(() => {
      current = Math.min(current + step, score);
      setDisplay(current);
      if (current >= score) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [score]);

  const getClass = (s) => {
    if (s <= 20) return "safe";
    if (s <= 40) return "low";
    if (s <= 70) return "medium";
    return "critical";
  };

  const getLabel = (s) => {
    if (s <= 20) return "Safe";
    if (s <= 40) return "Low Risk";
    if (s <= 70) return "Medium Risk";
    return "Critical Threat";
  };

  const getDesc = (s) => {
    if (s <= 20) return "No significant phishing indicators detected.";
    if (s <= 40) return "Minor anomalies found — review the details below.";
    if (s <= 70) return "Multiple threat indicators detected — exercise caution.";
    return "Severe phishing indicators found — do not interact with this content.";
  };

  const cls = getClass(score);
  const icons = { safe: "✓", low: "⚠", medium: "⚠", critical: "✕" };

  return (
    <div className="risk-meter">
      <div className="risk-top">
        <div className="risk-left">
          <div className={`risk-badge ${cls}`}>
            {icons[cls]} {getLabel(score)}
          </div>
          <p className="risk-description">{getDesc(score)}</p>
        </div>
        <div className="risk-score-wrap">
          <div className={`risk-score ${cls}`}>
            {display}<span className="risk-score-unit">/100</span>
          </div>
        </div>
      </div>

      <div className="risk-bar-track">
        <div className={`risk-bar-fill ${cls}`} style={{ width: `${score}%` }} />
      </div>

      <div className="risk-footer">
        <span>THREAT SCORE: {score}%</span>
        <span>ENGINE: Pattern Recognition v2.0</span>
      </div>
    </div>
  );
}
