import UrlScanner from "./components/UrlScanner";
import EmailScanner from "./components/EmailScanner";

export default function App() {
  return (
    <div style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "30px 20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      minHeight: "100vh"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{
          margin: "0 0 10px 0",
          color: "#1a73e8",
          fontSize: "32px"
        }}>
          🛡️ Phishing & Fraud Detector
        </h1>
        <p style={{
          margin: "0 0 20px 0",
          color: "#666",
          fontSize: "14px"
        }}>
          Advanced detection system for phishing links and fraudulent emails. Analyzes URLs and email content for common phishing patterns and social engineering tactics.
        </p>

        <hr style={{ margin: "20px 0", borderColor: "#eee" }} />
        
        <UrlScanner />

        <hr style={{ margin: "20px 0", borderColor: "#eee" }} />
        
        <EmailScanner />

        <hr style={{ margin: "20px 0", borderColor: "#eee" }} />
        
        <div style={{
          backgroundColor: "#e8f4f8",
          padding: "15px",
          borderRadius: "5px",
          borderLeft: "4px solid #0288d1",
          marginTop: "20px"
        }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#0288d1" }}>ℹ️ How This Works</h4>
          <ul style={{ margin: "0 0 10px 0", paddingLeft: "20px", fontSize: "13px", color: "#555" }}>
            <li><strong>URL Analysis:</strong> Detects homograph attacks, misspelled domains, suspicious protocols, IP addresses, and malicious patterns</li>
            <li><strong>Email Analysis:</strong> Identifies urgent language, fake rewards, data requests, impersonation, grammar errors, and suspicious links</li>
            <li><strong>Risk Scoring:</strong> Combines multiple detection methods to assign a comprehensive fraud risk score</li>
            <li><strong>Local Processing:</strong> All analysis happens in your browser - nothing is sent to external servers</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: "#fff3cd",
          padding: "15px",
          borderRadius: "5px",
          borderLeft: "4px solid #ff9800",
          marginTop: "15px"
        }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#ff9800" }}>⚠️ Important Disclaimer</h4>
          <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
            This tool uses advanced heuristic analysis and pattern matching but does NOT guarantee 100% accuracy. 
            It should be used as an additional security layer alongside email filters, two-factor authentication, and user vigilance. 
            Never click suspicious links or provide sensitive information even if this tool marks content as "safe".
          </p>
        </div>
      </div>
    </div>
  );
}
