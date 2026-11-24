"use strict";

// Conservative thresholds for aggregated STRATZ observations.
// These labels describe evidence volume, not causal strength or guaranteed win probability.
const DEFAULT_THRESHOLDS = Object.freeze({ high: 100, medium: 30, low: 10 });

function classifyEvidence(matchCount, thresholds = DEFAULT_THRESHOLDS) {
  const count = Number(matchCount);
  if (!Number.isFinite(count) || count < 0) {
    return { sampleSize: null, confidence: "unknown", eligibleForRecommendation: false };
  }
  const sampleSize = Math.floor(count);
  if (sampleSize >= thresholds.high) {
    return { sampleSize, confidence: "high", eligibleForRecommendation: true };
  }
  if (sampleSize >= thresholds.medium) {
    return { sampleSize, confidence: "medium", eligibleForRecommendation: true };
  }
  if (sampleSize >= thresholds.low) {
    return { sampleSize, confidence: "low", eligibleForRecommendation: false };
  }
  return { sampleSize, confidence: "insufficient", eligibleForRecommendation: false };
}

function summarizeEvidence(rows = []) {
  const summary = { total: rows.length, high: 0, medium: 0, low: 0, insufficient: 0, unknown: 0, recommendationEligible: 0 };
  for (const row of rows) {
    const result = classifyEvidence(row && row.matchCount);
    summary[result.confidence] += 1;
    if (result.eligibleForRecommendation) summary.recommendationEligible += 1;
  }
  return summary;
}

module.exports = { DEFAULT_THRESHOLDS, classifyEvidence, summarizeEvidence };
