export function analyzeUrl(url) {
  let score = 0;
  let reasons = [];

  if (url.length > 75) {
    score += 10;
    reasons.push("URL is unusually long");
  }

  if (!url.startsWith("https://")) {
    score += 15;
    reasons.push("URL does not use HTTPS");
  }

  if (url.includes("@")) {
    score += 20;
    reasons.push("URL contains '@' symbol");
  }

  const suspiciousWords = [
    "login", "verify", "bank", "secure",
    "update", "free", "gift"
  ];

  suspiciousWords.forEach(word => {
    if (url.toLowerCase().includes(word)) {
      score += 10;
      reasons.push(`Suspicious keyword detected: ${word}`);
    }
  });

  const badTLDs = [".tk", ".ml", ".cf", ".ga", ".xyz"];
  badTLDs.forEach(tld => {
    if (url.endsWith(tld)) {
      score += 15;
      reasons.push(`Suspicious domain extension: ${tld}`);
    }
  });

  if (url.match(/\d+\.\d+\.\d+\.\d+/)) {
    score += 25;
    reasons.push("IP address used instead of domain");
  }

  return {
    score: Math.min(score, 100),
    reasons
  };
}
