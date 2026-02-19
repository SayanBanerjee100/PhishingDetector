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
    "disabled account": 25
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
    "tax refund pending"
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
    "date of birth": 20
  };

  for (const [request, points] of Object.entries(sensitiveRequests)) {
    if (lowerText.includes(request)) {
      score += points;
      reasons.push(`🚨 CRITICAL: Request for sensitive data - "${request}"`);
    }
  }

  // 4. IMPERSONATION PATTERNS
  const impersonationPatterns = [
    { pattern: "dear customer", score: 15 },
    { pattern: "dear user", score: 15 },
    { pattern: "dear valued customer", score: 12 },
    { pattern: "to our customers", score: 12 },
    { pattern: "valued member", score: 12 }
  ];

  impersonationPatterns.forEach(({ pattern, score: pts }) => {
    if (lowerText.includes(pattern)) {
      score += pts;
      reasons.push(`⚠️ Generic greeting (not personalized) - "${pattern}"`);
    }
  });

  // 5. SPELLING & GRAMMAR ERRORS
  const commonErrors = [
    { error: "recieve", fix: "receive" },
    { error: "occured", fix: "occurred" },
    { error: "seperate", fix: "separate" },
    { error: "neccessary", fix: "necessary" },
    { error: "bussiness", fix: "business" },
    { error: "sucessful", fix: "successful" }
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

  // 6. POOR GRAMMAR/AWKWARD PHRASING
  const awkwardPhrases = [
    "thank you for very banking",
    "please to confirm",
    "your account have been",
    "we requests you",
    "make to verify"
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
    "noreply@account.verification"
  ];

  fakeSignatures.forEach(sig => {
    if (lowerText.includes(sig)) {
      score += 15;
      reasons.push(`⚠️ Suspicious/generic email signature`);
    }
  });

  // 8. LINK ANALYSIS
  const urlMatches = text.match(/https?:\/\/[^\s]+/gi) || [];
  if (urlMatches.length > 0) {
    reasons.push(`🔗 ${urlMatches.length} link(s) detected in email`);
    
    // Check for display text mismatch
    const displayLinkMismatch = text.match(/\[([^\]]+)\]\(([^\)]+)\)/g) || [];
    displayLinkMismatch.forEach(match => {
      const parts = match.match(/\[([^\]]+)\]\(([^\)]+)\)/);
      if (parts && parts[1] !== parts[2]) {
        score += 15;
        reasons.push(`⚠️ CRITICAL: Link text doesn't match URL - potential spoofing`);
      }
    });

    // Check for suspicious shortened URLs or redirects
    urlMatches.forEach(url => {
      if (url.includes("bit.ly") || url.includes("tinyurl") || url.includes("short.link")) {
        score += 15;
        reasons.push(`⚠️ Shortened/obfuscated URL detected - destination unknown`);
      }
      if (url.includes("@")) {
        score += 20;
        reasons.push(`🚨 CRITICAL: URL with authentication bypass attempt`);
      }
    });
  }

  // 9. SUSPICIOUS SENDER CLUES
  const senderSuspicious = [
    "noreply@", "no-reply@", "support-alert@",
    "verify@", "confirm@", "security-alert@",
    "urgent-action@", "account-alert@"
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
    "contact authorities"
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
    { text: "we understand", score: 8 }
  ];

  emotionalTriggers.forEach(({ text: trigger, score: pts }) => {
    if (lowerText.includes(trigger)) {
      score += pts;
      reasons.push(`⚠️ Emotional manipulation detected: "${trigger}"`);
    }
  });

  // 12. URGENCY COMBINED WITH ACTION
  if ((lowerText.match(/urgent|immediate|now|immediately|act|click|confirm/g) || []).length >= 4) {
    score += 15;
    reasons.push(`🚨 Excessive urgency + call-to-action combination`);
  }

  // 13. UNUSUAL FORMATTING
  if (/\*{2,}|\_{2,}|={2,}|!{2,}/.test(text)) {
    score += 5;
    reasons.push(`⚠️ Unusual text formatting (excessive emphasis)`);
  }

  // 14. NO LEGITIMATE CONTACT INFORMATION
  if (!lowerText.match(/phone|contact|address|support|customer service/i)) {
    score += 10;
    reasons.push(`⚠️ Missing legitimate contact information`);
  }

  // 15. REQUEST TO DISABLE SECURITY
  if (lowerText.includes("disable antivirus") || lowerText.includes("turn off protection")) {
    score += 30;
    reasons.push(`🚨 CRITICAL: Request to disable security measures`);
  }

  return {
    score: Math.min(score, 100),
    reasons: reasons.length > 0 ? reasons : ["✅ No major phishing indicators detected"]
  };
}
