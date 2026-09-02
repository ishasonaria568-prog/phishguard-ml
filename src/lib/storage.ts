import { ScanResult } from '../types';

const STORAGE_KEY = 'phishguard_scan_history_v1';

export function getStoredScans(): ScanResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveScanToStorage(scan: ScanResult): ScanResult[] {
  try {
    const current = getStoredScans();
    // Keep max 200 items
    const updated = [scan, ...current.filter(item => item.id !== scan.id)].slice(0, 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [scan];
  }
}

export function clearStoredScans(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
}

export function exportScansAsJSON(scans: ScanResult[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scans, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `phishguard_scans_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportScansAsCSV(scans: ScanResult[]): void {
  if (scans.length === 0) return;

  const headers = [
    'ID', 'URL', 'RiskScore', 'Classification', 'Confidence', 'Latency_MS', 'ScannedAt',
    'IsHTTPS', 'IsIP', 'IsShortener', 'DomainEntropy', 'KeywordsCount', 'Subdomains'
  ];

  const rows = scans.map(s => [
    `"${s.id}"`,
    `"${s.url.replace(/"/g, '""')}"`,
    s.risk_score,
    `"${s.classification}"`,
    s.confidence,
    s.latency_ms,
    `"${s.scanned_at}"`,
    s.features.is_https,
    s.features.is_ip_address,
    s.features.is_shortener,
    s.features.domain_entropy,
    s.features.suspicious_keyword_count,
    s.features.num_subdomains
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `phishguard_dataset_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
