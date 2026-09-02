import { UrlFeatures } from '../types';

export const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'security',
  'account', 'update', 'banking', 'authenticate', 'auth', 'confirm',
  'password', 'credential', 'wallet', 'crypto', 'paypal', 'appleid',
  'netflix', 'amazon', 'microsoft', 'recovery', 'suspended', 'unusual',
  'checkpoint', 'billing', 'invoice', 'claim', 'reward', 'dispute'
];

export const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'work', 'click', 'gq', 'cf', 'tk', 'ml', 'ga', 'men',
  'bid', 'stream', 'loan', 'date', 'racing', 'win', 'party', 'review',
  'country', 'kim', 'cricket', 'science', 'club', 'buzz'
]);

export const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 'ow.ly',
  'rebrand.ly', 'tiny.cc', 'cutt.ly', 'goo.gl', 'qr.ae', 'trib.al'
]);

const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Computes the Shannon Entropy of a string to measure character randomness.
 */
export function calculateEntropy(text: string): number {
  if (!text) return 0;
  const map: Record<string, number> = {};
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    map[c] = (map[c] || 0) + 1;
  }
  const len = text.length;
  let entropy = 0;
  for (const key in map) {
    const p = map[key] / len;
    entropy -= p * Math.log2(p);
  }
  return Math.round(entropy * 1000) / 1000;
}

/**
 * 100% Offline Static Feature Extractor
 * Extracts all 16 static features directly without network calls.
 */
export function extractUrlFeatures(rawUrl: string): UrlFeatures {
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    // Fallback parsing for invalid URLs
    const dummy = 'http://invalid-url.local';
    parsed = new URL(dummy);
  }

  const hostname = parsed.hostname.toLowerCase();
  const path = parsed.pathname;
  const query = parsed.search ? parsed.search.slice(1) : '';
  const fullUrlLower = url.toLowerCase();

  // 1. Length features
  const url_length = url.length;
  const domain_length = hostname.length;

  // 2. Subdomains count
  const hostParts = hostname.split('.');
  const num_subdomains = hostParts.length > 2 ? hostParts.length - 2 : 0;

  // 3. Punctuation & counts
  const num_dots = (url.match(/\./g) || []).length;
  const num_hyphens = (url.match(/-/g) || []).length;
  const num_digits = (url.match(/\d/g) || []).length;

  // 4. Special characters
  const specialCharsRegex = /[!#$%&'()*+,/:;<=>?@[\\\]^_`{|}~-]/g;
  const num_special_chars = (url.match(specialCharsRegex) || []).length;

  // 5. Flags
  const has_at_symbol = url.includes('@') ? 1 : 0;
  const is_ip_address = IP_REGEX.test(hostname) ? 1 : 0;
  const is_https = parsed.protocol === 'https:' ? 1 : 0;

  // 6. Keywords
  const extracted_keywords = SUSPICIOUS_KEYWORDS.filter((kw) => fullUrlLower.includes(kw));
  const suspicious_keyword_count = extracted_keywords.length;

  // 7. Domain Entropy
  const domain_entropy = calculateEntropy(hostname);

  // 8. Shortener
  const is_shortener = Array.from(SHORTENER_DOMAINS).some((short) => hostname.includes(short)) ? 1 : 0;

  // 9. Query & Path
  const query_param_count = query ? query.split('&').length : 0;
  const path_length = path.length;

  // 10. Secondary Heuristics
  const tld = hostParts.length > 1 ? hostParts[hostParts.length - 1] : '';
  const is_suspicious_tld = SUSPICIOUS_TLDS.has(tld) ? 1 : 0;
  const has_prefix_suffix_hyphen = hostname.includes('-') ? 1 : 0;
  const has_double_slash_redirect = path.includes('//') ? 1 : 0;

  return {
    url_length,
    domain_length,
    num_subdomains,
    num_dots,
    num_hyphens,
    num_digits,
    num_special_chars,
    has_at_symbol,
    is_ip_address,
    is_https,
    suspicious_keyword_count,
    domain_entropy,
    is_shortener,
    query_param_count,
    path_length,
    is_suspicious_tld,
    has_prefix_suffix_hyphen,
    has_double_slash_redirect,
    extracted_keywords,
    hostname,
    scheme: parsed.protocol.replace(':', ''),
    path,
    query,
    tld
  };
}
