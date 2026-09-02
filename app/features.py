"""
PhishGuard - Offline Feature Extraction Module
100% Free & Open-Source. No external API calls.
Extracts 16 static features directly from raw URLs.
"""

import math
import re
from urllib.parse import urlparse
from collections import Counter
from typing import Dict, Any, List

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "verification", "secure", "security",
    "account", "update", "banking", "authenticate", "auth", "confirm",
    "password", "credential", "wallet", "crypto", "paypal", "appleid",
    "netflix", "amazon", "microsoft", "recovery", "suspended", "unusual",
    "checkpoint", "billing", "invoice", "claim", "reward", "dispute"
]

SUSPICIOUS_TLDS = {
    "xyz", "top", "work", "click", "gq", "cf", "tk", "ml", "ga", "men",
    "bid", "stream", "loan", "date", "racing", "win", "party", "review",
    "country", "kim", "cricket", "science", "club", "buzz"
}

SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly",
    "rebrand.ly", "tiny.cc", "cutt.ly", "goo.gl", "qr.ae", "trib.al"
}

IP_REGEX = re.compile(
    r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
)

FEATURE_COLUMNS = [
    "url_length", "domain_length", "num_subdomains", "num_dots", "num_hyphens",
    "num_digits", "num_special_chars", "has_at_symbol", "is_ip_address", "is_https",
    "suspicious_keyword_count", "domain_entropy", "is_shortener", "query_param_count", "path_length"
]


def calculate_entropy(text: str) -> float:
    """Calculates Shannon Entropy of a string."""
    if not text:
        return 0.0
    counter = Counter(text)
    length = len(text)
    entropy = -sum((count / length) * math.log2(count / length) for count in counter.values())
    return round(entropy, 3)


def extract_features(raw_url: str) -> Dict[str, Any]:
    """
    Extracts static features from a URL without performing any external network requests.
    """
    url = raw_url.strip()
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    parsed = urlparse(url)
    hostname = (parsed.hostname or "").lower()
    path = parsed.path or ""
    query = parsed.query or ""
    full_url = url.lower()

    # 1. URL Length
    url_length = len(url)

    # 2. Domain Length
    domain_length = len(hostname)

    # 3. Subdomains Count
    host_parts = hostname.split(".")
    num_subdomains = max(0, len(host_parts) - 2) if len(host_parts) > 2 else 0

    # 4. Dot Count
    num_dots = url.count(".")

    # 5. Hyphen Count
    num_hyphens = url.count("-")

    # 6. Digit Count
    num_digits = sum(c.isdigit() for c in url)

    # 7. Special Characters Count
    special_chars = set("!#$%&'()*+,/:;<=>?@[\\]^_`{|}~-")
    num_special_chars = sum(c in special_chars for c in url)

    # 8. @ Symbol
    has_at_symbol = 1 if "@" in url else 0

    # 9. IP Address Detection
    is_ip_address = 1 if IP_REGEX.match(hostname) else 0

    # 10. HTTPS Detection
    is_https = 1 if parsed.scheme == "https" else 0

    # 11. Suspicious Keywords
    found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in full_url]
    suspicious_keyword_count = len(found_keywords)

    # 12. Domain Entropy
    domain_entropy = calculate_entropy(hostname)

    # 13. URL Shortener Detection
    is_shortener = 1 if any(shortener in hostname for shortener in SHORTENER_DOMAINS) else 0

    # 14. Query Parameter Count
    query_param_count = len(query.split("&")) if query else 0

    # 15. Path Length
    path_length = len(path)

    # Secondary static heuristics
    tld = host_parts[-1] if host_parts else ""
    is_suspicious_tld = 1 if tld in SUSPICIOUS_TLDS else 0
    has_prefix_suffix_hyphen = 1 if "-" in hostname else 0
    has_double_slash_redirect = 1 if "//" in path else 0

    features = {
        "url_length": url_length,
        "domain_length": domain_length,
        "num_subdomains": num_subdomains,
        "num_dots": num_dots,
        "num_hyphens": num_hyphens,
        "num_digits": num_digits,
        "num_special_chars": num_special_chars,
        "has_at_symbol": has_at_symbol,
        "is_ip_address": is_ip_address,
        "is_https": is_https,
        "suspicious_keyword_count": suspicious_keyword_count,
        "domain_entropy": domain_entropy,
        "is_shortener": is_shortener,
        "query_param_count": query_param_count,
        "path_length": path_length,
        "is_suspicious_tld": is_suspicious_tld,
        "has_prefix_suffix_hyphen": has_prefix_suffix_hyphen,
        "has_double_slash_redirect": has_double_slash_redirect,
        "extracted_keywords": found_keywords,
        "hostname": hostname,
        "scheme": parsed.scheme,
        "path": path,
        "query": query,
        "tld": tld
    }

    return features
