export function analyzeEmail(text) {
  let score = 0;
  let reasons = [];

  const urgentWords = [
    "urgent", "immediately", "act now",
    "account suspended", "verify now"
  ];

  urgentWords.forEach(word => {
    if (text.toLowerCase().includes(word)) {
      score += 15;
      reasons.push(`Urgent language detected: "${word}"`);
    }
  });

  if (text.match(/free|reward|winner|gift/i)) {
    score += 10;
    reasons.push("Fake reward language detected");
  }

  if (text.match(/password|otp|credit card|bank/i)) {
    score += 25;
    reasons.push("Sensitive information request detected");
  }

  if (text.match(/http(s)?:\/\//)) {
    score += 10;
    reasons.push("Email contains clickable links");
  }

  return {
    score: Math.min(score, 100),
    reasons
  };
}
