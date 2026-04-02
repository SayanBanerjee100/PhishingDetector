export function analyzeEmail(text) {
  let score = 0;
  let reasons = [];
  const lowerText = text.toLowerCase();

  // 1. URGENT/THREATENING LANGUAGE
  const urgentTriggers = {
    "urgent action required": 20,
    "account suspended": 25,
    "verify your account": 25,
    "confirm your identity": 20,
    "immediate action": 20,
    "act now": 18,
    "click here immediately": 25,
    "limited time": 15,
    "expire": 18,
    "unauthorized access": 20,
    "suspicious activity": 18,
    "confirm within 24 hours": 25,
    "disabled account": 25,
    "account locked": 25,
    "security breach": 25,
    "fraudulent activity": 20,
    "compromise detected": 25,
    "action required": 15,
    "time sensitive": 15,
    "deadline approaching": 15
  };

  for (const [trigger, points] of Object.entries(urgentTriggers)) {
    if (lowerText.includes(trigger)) {
      score += points;
      reasons.push(`🚨 Urgent/threatening language: "${trigger}"`);
    }
  }

  // 2. FAKE REWARD/PRIZE LANGUAGE
  const fakeRewards = [
    "congratulations, you've won",
    "claim your prize",
    "has selected you",
    "winner selected",
    "free money",
    "reward waiting",
    "lucky winner",
    "inherited money",
    "tax refund pending",
    "lottery winner",
    "prize notification",
    "inheritance claim",
    "unclaimed funds",
    "money transfer",
    "wire transfer pending"
  ];

  fakeRewards.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      score += 20;
      reasons.push(`⚠️ Fake reward/prize language: "${phrase}"`);
    }
  });

  // 3. SENSITIVE DATA REQUESTS
  const sensitiveRequests = {
    "password": 30,
    "credit card": 35,
    "cvv": 35,
    "social security": 35,
    "bank account": 30,
    "otp": 25,
    "pin": 25,
    "secret answers": 25,
    "mother's maiden name": 25,
    "date of birth": 20,
    "ssn": 35,
    "bank routing": 30,
    "account number": 30,
    "security code": 25,
    "verification code": 20,
    "two factor": 20,
    "2fa code": 20,
    "authentication code": 20
  };

  for (const [request, points] of Object.entries(sensitiveRequests)) {
    if (lowerText.includes(request)) {
      score += points;
      reasons.push(`🚨 CRITICAL: Request for sensitive data - "${request}"`);
    }
  }

  // 4. ADVANCED IMPERSONATION PATTERNS
  const impersonationPatterns = [
    { pattern: "dear customer", score: 15 },
    { pattern: "dear user", score: 15 },
    { pattern: "dear valued customer", score: 12 },
    { pattern: "to our customers", score: 12 },
    { pattern: "valued member", score: 12 },
    { pattern: "dear account holder", score: 15 },
    { pattern: "dear client", score: 12 },
    { pattern: "hello user", score: 10 },
    { pattern: "attention customer", score: 15 },
    { pattern: "important notice", score: 12 }
  ];

  impersonationPatterns.forEach(({ pattern, score: pts }) => {
    if (lowerText.includes(pattern)) {
      score += pts;
      reasons.push(`⚠️ Generic greeting (not personalized) - "${pattern}"`);
    }
  });

  // 5. ADVANCED SPELLING & GRAMMAR ANALYSIS
  const commonErrors = [
    { error: "recieve", fix: "receive" },
    { error: "occured", fix: "occurred" },
    { error: "seperate", fix: "separate" },
    { error: "neccessary", fix: "necessary" },
    { error: "bussiness", fix: "business" },
    { error: "sucessful", fix: "successful" },
    { error: "accomodate", fix: "accommodate" },
    { error: "definately", fix: "definitely" },
    { error: "existance", fix: "existence" },
    { error: "priviledge", fix: "privilege" },
    { error: "wierd", fix: "weird" },
    { error: "reccomend", fix: "recommend" }
  ];

  let errorCount = 0;
  commonErrors.forEach(({ error }) => {
    if (lowerText.includes(error)) {
      errorCount++;
    }
  });

  if (errorCount > 0) {
    score += errorCount * 5;
    reasons.push(`⚠️ ${errorCount} spelling/grammar errors detected - common in phishing`);
  }

  // 6. ADVANCED GRAMMAR ANALYSIS
  const awkwardPhrases = [
    "thank you for very banking",
    "please to confirm",
    "your account have been",
    "we requests you",
    "make to verify",
    "you are receive",
    "account is suspend",
    "please update immediate",
    "your information is require",
    "we need verify you",
    "click for confirm",
    "login to your account now"
  ];

  awkwardPhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      score += 10;
      reasons.push(`⚠️ Awkward/poor grammar: "${phrase}"`);
    }
  });

  // 7. FAKE COMPANY SIGNATURES
  const fakeSignatures = [
    "sincerely, paypal department",
    "best regards, amazon security",
    "yours truly, bank security team",
    "support team automated response",
    "noreply@account.verification",
    "security@notification.service",
    "admin@system.alert",
    "support@help.desk",
    "noreply@auto.response"
  ];

  fakeSignatures.forEach(sig => {
    if (lowerText.includes(sig)) {
      score += 15;
      reasons.push(`⚠️ Suspicious/generic email signature`);
    }
  });

  // 8. ADVANCED LINK ANALYSIS
  const urlMatches = text.match(/https?:\/\/[^\s]+/gi) || [];
  if (urlMatches.length > 0) {
    reasons.push(`🔗 ${urlMatches.length} link(s) detected in email`);

    // Check for display text mismatch
    const displayLinkMismatch = text.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    displayLinkMismatch.forEach(match => {
      const parts = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (parts && parts[1] !== parts[2]) {
        score += 15;
        reasons.push(`⚠️ CRITICAL: Link text doesn't match URL - potential spoofing`);
      }
    });

    // ADVANCED: Check for suspicious shortened URLs and redirect services
    const suspiciousUrlServices = [
      "bit.ly", "tinyurl.com", "short.link", "t.co", "goo.gl",
      "ow.ly", "is.gd", "buff.ly", "adf.ly", "tiny.cc",
      "cli.gs", "qr.net", "1url.com", "tweez.me", "v.gd",
      "tr.im", "link.zip.net", "url.ie", "tiny.pl", "x.co"
    ];

    urlMatches.forEach(url => {
      const urlLower = url.toLowerCase();
      if (suspiciousUrlServices.some(service => urlLower.includes(service))) {
        score += 20;
        reasons.push(`🚨 CRITICAL: URL shortener/redirect service detected - destination unknown`);
      }
      if (url.includes("@")) {
        score += 25;
        reasons.push(`🚨 CRITICAL: URL with authentication bypass attempt`);
      }
      // Check for excessive subdomains
      const subdomainCount = (url.match(/\./g) || []).length;
      if (subdomainCount > 3) {
        score += 15;
        reasons.push(`⚠️ Excessive subdomains in URL - suspicious redirect chain`);
      }
    });
  }

  // 9. ADVANCED SENDER ANALYSIS
  const senderSuspicious = [
    "noreply@", "no-reply@", "support-alert@",
    "verify@", "confirm@", "security-alert@",
    "urgent-action@", "account-alert@",
    "notification@", "alert@", "warning@",
    "admin@", "system@", "auto@",
    "service@", "mail@", "info@"
  ];

  senderSuspicious.forEach(pattern => {
    if (lowerText.includes(pattern)) {
      score += 12;
      reasons.push(`⚠️ Suspicious sender email pattern: "${pattern}"`);
    }
  });

  // 10. THREATENING/BLACKMAIL LANGUAGE
  const threats = [
    "your account will be closed",
    "we will suspend",
    "we will delete",
    "will be locked",
    "prevent you from",
    "take legal action",
    "contact authorities",
    "report to authorities",
    "legal consequences",
    "criminal charges",
    "police involvement",
    "account termination",
    "permanent ban",
    "service disruption"
  ];

  threats.forEach(threat => {
    if (lowerText.includes(threat)) {
      score += 20;
      reasons.push(`🚨 Threatening language detected: "${threat}"`);
    }
  });

  // 11. EMOTIONAL MANIPULATION
  const emotionalTriggers = [
    { text: "we care about", score: 8 },
    { text: "for your protection", score: 10 },
    { text: "for your security", score: 10 },
    { text: "trust us", score: 8 },
    { text: "we understand", score: 8 },
    { text: "we value you", score: 6 },
    { text: "your safety", score: 8 },
    { text: "protect your account", score: 10 },
    { text: "secure your information", score: 10 }
  ];

  emotionalTriggers.forEach(({ text: trigger, score: pts }) => {
    if (lowerText.includes(trigger)) {
      score += pts;
      reasons.push(`⚠️ Emotional manipulation detected: "${trigger}"`);
    }
  });

  // 12. URGENCY COMBINED WITH ACTION
  const urgencyWords = lowerText.match(/urgent|immediate|now|immediately|act|click|confirm|quickly|fast|rush/g) || [];
  if (urgencyWords.length >= 4) {
    score += 15;
    reasons.push(`🚨 Excessive urgency + call-to-action combination (${urgencyWords.length} urgency indicators)`);
  }

  // 13. UNUSUAL FORMATTING
  if (/\*{2,}|_{2,}|={2,}|!{2,}/.test(text)) {
    score += 5;
    reasons.push(`⚠️ Unusual text formatting (excessive emphasis)`);
  }

  // 14. NO LEGITIMATE CONTACT INFORMATION
  if (!lowerText.match(/phone|contact|address|support|customer service|help desk|1-800|tel:/i)) {
    score += 10;
    reasons.push(`⚠️ Missing legitimate contact information`);
  }

  // 15. REQUEST TO DISABLE SECURITY
  const securityDisable = [
    "disable antivirus", "turn off protection", "disable firewall",
    "turn off security", "disable popup blocker", "allow popups",
    "enable macros", "run as administrator", "bypass security"
  ];

  securityDisable.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      score += 30;
      reasons.push(`🚨 CRITICAL: Request to disable security measures`);
    }
  });

  // 16. ADVANCED PHISHING PATTERNS
  const advancedPatterns = [
    { pattern: "update your payment method", score: 20 },
    { pattern: "verify your payment information", score: 25 },
    { pattern: "confirm your billing address", score: 20 },
    { pattern: "your subscription expires", score: 15 },
    { pattern: "renewal required", score: 15 },
    { pattern: "payment failed", score: 20 },
    { pattern: "billing issue", score: 15 },
    { pattern: "account verification required", score: 20 },
    { pattern: "identity verification", score: 20 },
    { pattern: "security update required", score: 18 }
  ];

  advancedPatterns.forEach(({ pattern, score: pts }) => {
    if (lowerText.includes(pattern)) {
      score += pts;
      reasons.push(`⚠️ Advanced phishing pattern: "${pattern}"`);
    }
  });

  // 17. SUSPICIOUS ATTACHMENT INDICATORS
  const attachmentIndicators = [
    "attachment included", "download attachment", "open attachment",
    "view attachment", "check attachment", "see attachment"
  ];

  attachmentIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) {
      score += 15;
      reasons.push(`⚠️ Suspicious attachment reference: "${indicator}"`);
    }
  });

  // 18. FAKE TECHNICAL LANGUAGE
  const fakeTech = [
    "system maintenance", "technical issue", "server problem",
    "database error", "connection problem", "sync issue",
    "authentication error", "session expired", "login timeout"
  ];

  fakeTech.forEach(tech => {
    if (lowerText.includes(tech)) {
      score += 8;
      reasons.push(`⚠️ Fake technical issue pretext: "${tech}"`);
    }
  });

  return {
    score: Math.min(score, 100),
    reasons: reasons.length > 0 ? reasons : ["✅ No major phishing indicators detected"]
  };
}
