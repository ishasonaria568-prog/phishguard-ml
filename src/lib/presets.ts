import { PresetURL } from '../types';

export const PRESET_URLS: PresetURL[] = [
  {
    category: 'Legitimate',
    title: 'Google Official Search',
    url: 'https://www.google.com',
    expected: 'SAFE',
    description: 'Clean HTTPS domain with low entropy and standard single subdomain.'
  },
  {
    category: 'Legitimate',
    title: 'GitHub Linux Kernel Repo',
    url: 'https://github.com/torvalds/linux',
    expected: 'SAFE',
    description: 'Legitimate developer repository with clean path structure.'
  },
  {
    category: 'Legitimate',
    title: 'Python Official Documentation',
    url: 'https://docs.python.org/3/library/urllib.parse.html',
    expected: 'SAFE',
    description: 'Official software documentation host with verified authority.'
  },
  {
    category: 'Phishing',
    title: 'PayPal Typosquatting Attack',
    url: 'http://paypal-security-verification.xyz/login/verify.php?token=92841',
    expected: 'PHISHING',
    description: 'Insecure HTTP + suspicious .xyz TLD + multiple urgency keywords ("login", "verify", "security") + hyphenated brand name.'
  },
  {
    category: 'IP-Based',
    title: 'Direct IP Bank Spoof',
    url: 'http://192.168.1.100/auth/bankofamerica/secure-login.html',
    expected: 'PHISHING',
    description: 'Raw IPv4 hostname bypassing DNS verification + deceptive banking path hierarchy.'
  },
  {
    category: 'Phishing',
    title: 'Apple ID Fake Verification',
    url: 'http://apple-id-verify-account.top/manage/signin.php?step=2',
    expected: 'PHISHING',
    description: 'High-risk .top TLD + hyphenated squatting + login & account keywords.'
  },
  {
    category: 'Suspicious',
    title: 'Shortened URL Cloaking',
    url: 'http://bit.ly/secure-login-39281',
    expected: 'SUSPICIOUS',
    description: 'URL shortener obscuring target destination with embedded sensitive keywords.'
  },
  {
    category: 'Phishing',
    title: 'Deceptive @ Credential Delimiter',
    url: 'http://netflix.com@unauthorized-billing-portal.com/login',
    expected: 'PHISHING',
    description: 'Uses "@" symbol to fool the user into thinking netflix.com is the host, while navigating to the evil host.'
  },
  {
    category: 'Suspicious',
    title: 'High-Entropy Random Subdomain',
    url: 'https://x89a-k2910-secure-auth.club/checkpoint/login',
    expected: 'PHISHING',
    description: 'Algorithmic DGA randomness with high entropy (> 3.6 bits) and suspicious .club TLD.'
  }
];
