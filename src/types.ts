export interface UrlFeatures {
  url_length: number;
  domain_length: number;
  num_subdomains: number;
  num_dots: number;
  num_hyphens: number;
  num_digits: number;
  num_special_chars: number;
  has_at_symbol: number;
  is_ip_address: number;
  is_https: number;
  suspicious_keyword_count: number;
  domain_entropy: number;
  is_shortener: number;
  query_param_count: number;
  path_length: number;
  is_suspicious_tld?: number;
  has_prefix_suffix_hyphen?: number;
  has_double_slash_redirect?: number;
  extracted_keywords?: string[];
  hostname?: string;
  scheme?: string;
  path?: string;
  query?: string;
  tld?: string;
  [key: string]: any;
}

export type RiskClassification = 'SAFE' | 'SUSPICIOUS' | 'PHISHING';

export interface ScanResult {
  id: string;
  url: string;
  risk_score: number; // 0 to 100
  classification: RiskClassification;
  confidence: number; // e.g. 0.94
  latency_ms: number;
  scanned_at: string;
  features: UrlFeatures;
  explanations: Record<string, string>;
  is_offline: boolean;
}

export interface PresetURL {
  category: 'Legitimate' | 'Phishing' | 'Suspicious' | 'IP-Based' | 'Shortener';
  title: string;
  url: string;
  expected: RiskClassification;
  description: string;
}

export interface UrlAnatomySegment {
  name: string;
  value: string;
  riskLevel: 'safe' | 'warning' | 'danger' | 'neutral';
  note: string;
  color: string;
}

export interface ModelMetrics {
  accuracy: number;
  roc_auc: number;
  precision: number;
  recall: number;
  f1_score: number;
  cv_score: number;
  total_samples: number;
  feature_importances: { name: string; label: string; importance: number; icon: string }[];
}
