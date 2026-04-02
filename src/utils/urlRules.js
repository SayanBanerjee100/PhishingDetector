export function analyzeUrl(url) {
  let score = 0;
  let reasons = [];

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();
    const search = urlObj.search.toLowerCase();
    const fullUrl = url.toLowerCase();

    // 1. PROTOCOL CHECK
    if (urlObj.protocol !== "https:") {
      score += 25;
      reasons.push("🚨 CRITICAL: Missing HTTPS encryption - HIGH RISK");
    }

    // 2. IP ADDRESS CHECK
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      score += 40;
      reasons.push("🚨 CRITICAL: IP address used instead of domain - MALICIOUS");
    }

    // 3. AUTHENTICATION IN URL (@)
    if (url.includes("@")) {
      score += 35;
      reasons.push("🚨 CRITICAL: Username embedded in URL - PHISHING ATTACK");
    }

    // 4. PORT NUMBER IN URL
    if (url.includes(":") && /:\d+\//.test(url)) {
      score += 20;
      reasons.push("⚠️ Non-standard port used - potential bypass attempt");
    }

    // 5. ADVANCED UNICODE/HOMOGRAPH ATTACKS
    if (hostname.split('').some(char => char.charCodeAt(0) > 127)) {
      score += 30;
      reasons.push("🚨 CRITICAL: Unicode characters detected - homograph attack");
    }

    // Check for similar looking characters (visual spoofing)
    const suspiciousChars = /[０-９ａ-ｚＡ-Ｚ]/; // Full-width characters
    if (suspiciousChars.test(hostname)) {
      score += 25;
      reasons.push("🚨 CRITICAL: Full-width characters detected - visual spoofing");
    }

    // 6. ADVANCED MISSPELLING DETECTION
    const popularDomains = {
      "google": ["gooele", "gooogle", "g00gle", "googles", "gogle", "g00g1e", "goog1e"],
      "facebook": ["facebpok", "faceboook", "facebok", "fb-verify", "faceb00k", "fasebook"],
      "amazon": ["amaz0n", "amazn", "amzn-verify", "amaz0n-verify", "ama2on"],
      "apple": ["appl3", "appple", "apple-verify", "app1e", "aple"],
      "microsoft": ["microsft", "micosoft", "m1crosft", "micros0ft", "mircosoft"],
      "paypal": ["paypa1", "paypall", "paypa-verify", "payp4l", "p4ypal"],
      "instagram": ["instasram", "instagrsm", "instagram-verify", "instagrarn", "insta9ram"],
      "twitter": ["twittter", "twtter", "twitter-verify", "tw1tter", "twiter"],
      "netflix": ["netfl1x", "netf1ix", "netflix-verify", "netfl1x-login"],
      "linkedin": ["l1nkedin", "linkedln", "linkedin-verify", "link3din"],
      "yahoo": ["yah00", "yaho0", "yahoo-verify", "yah0o"],
      "ebay": ["3bay", "eb4y", "ebay-verify", "eb@y"],
      "github": ["githhub", "g1thub", "github-verify", "githb"],
      "dropbox": ["dr0pbox", "dropb0x", "dropbox-verify", "dr0pb0x"]
    };

    for (const [legit, fakes] of Object.entries(popularDomains)) {
      for (const fake of fakes) {
        if (hostname.includes(fake)) {
          score += 45;
          reasons.push(`🚨 CRITICAL: Misspelled domain detected - mimics "${legit}"`);
        }
      }
    }

    // 7. ADVANCED SUBDOMAIN SPOOFING
    const parts = hostname.split(".");
    if (parts.length > 3) {
      const subdomain = parts[0].toLowerCase();
      const suspiciousSubdomains = [
        "verify", "confirm", "secure", "account", "login", "update",
        "authenticate", "validate", "reset", "recover", "activate",
        "signin", "sign-in", "auth", "security", "alert", "notification",
        "admin", "administrator", "support", "help", "service",
        "billing", "payment", "banking", "wallet", "crypto"
      ];

      if (suspiciousSubdomains.includes(subdomain)) {
        score += 30;
        reasons.push(`🚨 CRITICAL: Suspicious subdomain: "${subdomain}" - phishing setup`);
      }
    }

    // 8. URL LENGTH ANALYSIS
    if (url.length > 150) {
      score += 15;
      reasons.push("⚠️ Excessively long URL - may hide malicious destination");
    }

    // 9. ADVANCED SUSPICIOUS KEYWORDS
    const suspiciousKeywords = [
      "secure", "verify", "confirm", "validate", "authenticate",
      "update", "urgent", "alert", "action-required", "click-here",
      "bank-access", "paypal", "amazon", "apple", "login-required",
      "account-update", "security-alert", "billing-issue", "payment-failed",
      "suspicious-activity", "unauthorized-access", "password-reset",
      "account-locked", "verify-identity", "confirm-email"
    ];

    suspiciousKeywords.forEach(keyword => {
      if (hostname.includes(keyword) || pathname.includes(keyword)) {
        score += 15;
        reasons.push(`⚠️ Suspicious keyword in URL: "${keyword}"`);
      }
    });

    // 10. EXCESSIVE REDIRECTS IN PATH
    if ((pathname.match(/\//g) || []).length > 6) {
      score += 15;
      reasons.push("⚠️ Excessive path depth - suspicious redirect chain");
    }

    // 11. ADVANCED QUERY PARAMETER ANALYSIS
    const paramMatch = search.match(/([a-z]+)=([^&]+)/gi) || [];
    if (paramMatch.length > 10) {
      score += 20;
      reasons.push("⚠️ Excessive number of tracking parameters - data collection attempt");
    }

    // Check for base64 or encoded content in params
    if (search.match(/=%[0-9A-F]{2}/i)) {
      score += 15;
      reasons.push("⚠️ URL-encoded parameters detected - potential obfuscation");
    }

    // Check for suspicious parameter names
    const suspiciousParams = ["redirect", "url", "return", "next", "callback", "ref"];
    paramMatch.forEach(param => {
      const paramName = param.split('=')[0].toLowerCase();
      if (suspiciousParams.includes(paramName)) {
        score += 10;
        reasons.push(`⚠️ Suspicious parameter: "${paramName}" - potential open redirect`);
      }
    });

    // 12. HIGH-RISK TLDs
    const badTLDs = [
      ".tk", ".ml", ".cf", ".ga", ".xyz", ".top", ".gq", ".tk", ".download",
      ".club", ".online", ".site", ".space", ".website", ".tech", ".store",
      ".bid", ".trade", ".webcam", ".date", ".party", ".review", ".science",
      ".faith", ".men", ".loan", ".work", ".gdn", ".win", ".bid", ".stream"
    ];
    if (badTLDs.some(tld => hostname.endsWith(tld))) {
      score += 25;
      reasons.push("🚨 CRITICAL: High-risk domain extension detected");
    }

    // 13. NEW/SUSPICIOUS DOMAINS (heuristic)
    const domainName = hostname.split(".")[0];
    if (domainName.length < 3) {
      score += 15;
      reasons.push("⚠️ Unusually short domain name - common for temporary phishing");
    }

    // 14. ADVANCED CHARACTER ANALYSIS (l33t speak)
    if (/[0o][ol1i][0o1il]/.test(domainName) || /[1il][0o]g[1il]n/.test(domainName)) {
      score += 20;
      reasons.push("⚠️ Domain uses confusing characters (0/O, 1/l/I) - l33t speak");
    }

    // 15. HYPHENS IN DOMAIN (common phishing tactic)
    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount > 2) {
      score += 18;
      reasons.push("⚠️ Multiple hyphens in domain - common phishing pattern");
    }

    // 16. FILES THAT SHOULDN'T BE ACCESSED DIRECTLY
    const suspiciousFiles = [
      "wp-admin", "wp-login", "admin.php", "administrator", ".git",
      ".env", "config.php", "backup", "database", "phpmyadmin",
      "adminer", "sql", "db", ".htaccess", ".htpasswd", "web.config",
      "server-status", "phpinfo", "test.php", "info.php"
    ];
    if (suspiciousFiles.some(file => pathname.includes(file))) {
      score += 25;
      reasons.push("🚨 CRITICAL: Suspicious admin/config file path exposure");
    }

    // 17. SUSPICIOUS PATH PATTERNS
    const suspiciousPaths = [
      "/login?", "/signin?", "/auth?", "/oauth?", "/sso?",
      "/reset?", "/forgot?", "/recover?", "/verify?", "/confirm?",
      "/update?", "/change?", "/modify?", "/edit?"
    ];
    if (suspiciousPaths.some(path => pathname.includes(path))) {
      score += 12;
      reasons.push("⚠️ Suspicious authentication path detected");
    }

    // 18. JAVASCRIPT INJECTION PATTERNS
    if (fullUrl.includes("javascript:") || fullUrl.includes("data:")) {
      score += 30;
      reasons.push("🚨 CRITICAL: JavaScript/data URL detected - XSS attempt");
    }

    // 19. MALICIOUS PROTOCOLS
    const maliciousProtocols = ["file:", "ftp:", "ldap:", "ldaps:"];
    if (maliciousProtocols.some(protocol => fullUrl.startsWith(protocol))) {
      score += 25;
      reasons.push("🚨 CRITICAL: Malicious protocol detected");
    }

    // 20. DOMAIN AGE INDICATORS (heuristic)
    // Check for domains that look newly registered
    const newDomainPatterns = [
      /\d{4,}/, // Years in domain
      /temp/, /test/, /demo/, /sample/,
      /new/, /fresh/, /quick/, /fast/
    ];
    if (newDomainPatterns.some(pattern => pattern.test(domainName))) {
      score += 10;
      reasons.push("⚠️ Domain name suggests temporary/throwaway registration");
    }

  } catch {
    score = 60;
    reasons.push("❌ Invalid or malformed URL detected - potential attack");
  }

  return {
    score: Math.min(score, 100),
    reasons: reasons.length > 0 ? reasons : ["✅ No major phishing indicators detected"]
  };
}
