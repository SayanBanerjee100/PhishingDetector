export function analyzeUrl(url) {
  let score = 0;
  let reasons = [];

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();
    const search = urlObj.search.toLowerCase();

    // 1. PROTOCOL CHECK
    if (urlObj.protocol !== "https:") {
      score += 20;
      reasons.push("⚠️ Missing HTTPS encryption - HIGH RISK");
    }

    // 2. IP ADDRESS CHECK
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      score += 35;
      reasons.push("🚨 IP address used instead of domain - CRITICAL");
    }

    // 3. AUTHENTICATION IN URL (@)
    if (url.includes("@")) {
      score += 30;
      reasons.push("🚨 Username embedded in URL - CRITICAL PHISHING INDICATOR");
    }

    // 4. PORT NUMBER IN URL
    if (url.includes(":") && /:\d+\//.test(url)) {
      score += 15;
      reasons.push("⚠️ Non-standard port used - potential bypass attempt");
    }

    // 5. CHECK FOR UNICODE/HOMOGRAPH ATTACKS
    if (/[^\x00-\x7F]/.test(hostname)) {
      score += 25;
      reasons.push("🚨 Unicode characters detected - homograph attack risk");
    }

    // 6. SUSPICIOUS DOMAIN PATTERNS - MISSPELLINGS
    const popularDomains = {
      "google": ["gooele", "gooogle", "g00gle", "googles", "gogle"],
      "facebook": ["facebpok", "faceboook", "facebok", "fb-verify"],
      "amazon": ["amaz0n", "amazn", "amzn-verify"],
      "apple": ["appl3", "appple", "apple-verify"],
      "microsoft": ["microsft", "micosoft", "m1crosft"],
      "paypal": ["paypa1", "paypall", "paypa-verify"],
      "instagram": ["instasram", "instagrsm", "instagram-verify"],
      "twitter": ["twittter", "twtter", "twitter-verify"]
    };

    for (const [legit, fakes] of Object.entries(popularDomains)) {
      for (const fake of fakes) {
        if (hostname.includes(fake)) {
          score += 40;
          reasons.push(`🚨 CRITICAL: Misspelled domain detected - mimics "${legit}"`);
        }
      }
    }

    // 7. SUBDOMAIN SPOOFING
    const parts = hostname.split(".");
    if (parts.length > 3) {
      const subdomain = parts[0].toLowerCase();
      const suspiciousSubdomains = [
        "verify", "confirm", "secure", "account", "login", "update",
        "authenticate", "validate", "reset", "recover", "activate"
      ];
      
      if (suspiciousSubdomains.includes(subdomain)) {
        score += 25;
        reasons.push(`⚠️ Suspicious subdomain: "${subdomain}" - typical phishing setup`);
      }
    }

    // 8. URL LENGTH
    if (url.length > 100) {
      score += 10;
      reasons.push("⚠️ Excessively long URL - may hide destination");
    }

    // 9. SUSPICIOUS KEYWORDS IN DOMAIN
    const suspiciousKeywords = [
      "secure", "verify", "confirm", "validate", "authenticate",
      "update", "urgent", "alert", "action-required", "click-here",
      "bank-access", "paypal", "amazon", "apple"
    ];

    suspiciousKeywords.forEach(keyword => {
      if (hostname.includes(keyword) || pathname.includes(keyword)) {
        score += 12;
        reasons.push(`⚠️ Suspicious keyword in URL: "${keyword}"`);
      }
    });

    // 10. EXCESSIVE REDIRECTS IN PATH
    if ((pathname.match(/\//g) || []).length > 5) {
      score += 10;
      reasons.push("⚠️ Excessive path depth - may be redirect chain");
    }

    // 11. SUSPICIOUS QUERY PARAMETERS
    const paramMatch = search.match(/([a-z]+)=([^&]+)/gi) || [];
    if (paramMatch.length > 8) {
      score += 15;
      reasons.push("⚠️ Excessive number of tracking parameters");
    }

    // Check for base64 or encoded content in params
    if (search.match(/=%[0-9A-F]{2}/i)) {
      score += 10;
      reasons.push("⚠️ URL-encoded parameters detected - potential obfuscation");
    }

    // 12. BAD TLDs
    const badTLDs = [".tk", ".ml", ".cf", ".ga", ".xyz", ".top", ".gq", ".tk", ".download"];
    if (badTLDs.some(tld => hostname.endsWith(tld))) {
      score += 20;
      reasons.push("⚠️ High-risk domain extension detected");
    }

    // 13. NEW/SUSPICIOUS DOMAINS (heuristic)
    // Check if domain is too short or follows patterns of temporary services
    const domainName = hostname.split(".")[0];
    if (domainName.length < 3) {
      score += 10;
      reasons.push("⚠️ Unusually short domain name - common for temporary phishing");
    }

    // 14. NUMBERS AND SIMILAR CHARACTERS (l33t speak)
    if (/[0o][ol1i][0o1il]/.test(domainName)) {
      score += 15;
      reasons.push("⚠️ Domain uses confusing characters (0/O, 1/l/I)");
    }

    // 15. HYPHENS IN DOMAIN (common phishing tactic)
    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount > 1) {
      score += 12;
      reasons.push("⚠️ Multiple hyphens in domain - common phishing pattern");
    }

    // 16. FILES THAT SHOULDN'T BE ACCESSED DIRECTLY
    const suspiciousFiles = [
      "wp-admin", "wp-login", "admin.php", "administrator", ".git",
      ".env", "config.php", "backup", "database"
    ];
    if (suspiciousFiles.some(file => pathname.includes(file))) {
      score += 20;
      reasons.push("⚠️ Suspicious admin/config file path exposure");
    }

  } catch (e) {
    score = 50;
    reasons.push("❌ Invalid or malformed URL detected");
  }

  return {
    score: Math.min(score, 100),
    reasons: reasons.length > 0 ? reasons : ["✅ No major phishing indicators detected"]
  };
}
