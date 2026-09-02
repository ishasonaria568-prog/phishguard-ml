import React, { useState } from 'react';
import { 
  Layers, 
  Download, 
  Search, 
  Play, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  FileText,
  Filter,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { ScanResult, RiskClassification } from '../types';
import { evaluateUrl } from '../lib/mlModel';
import { exportScansAsCSV, exportScansAsJSON } from '../lib/storage';

const SAMPLE_BATCH = `https://www.google.com
https://github.com/torvalds/linux
http://paypal-security-verification.xyz/login/verify.php?token=92841
http://192.168.1.100/auth/bankofamerica/secure-login.html
http://apple-id-verify-account.top/manage/signin.php?step=2
http://bit.ly/secure-login-39281
https://en.wikipedia.org/wiki/Phishing
http://netflix-billing-suspended.gq/login?user=test
https://docs.python.org/3/library/urllib.parse.html
http://chase-online-banking-access.click/auth/login.jsp`;

interface BatchScannerProps {
  onScanBatchComplete: (results: ScanResult[]) => void;
  onSelectResult?: (result: ScanResult) => void;
}

export const BatchScanner: React.FC<BatchScannerProps> = ({ onScanBatchComplete, onSelectResult }) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_BATCH);
  const [batchResults, setBatchResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [totalLatency, setTotalLatency] = useState<number>(0);

  const handleRunBatch = () => {
    const lines = inputText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('#'));

    if (lines.length === 0) return;

    setIsScanning(true);
    const start = performance.now();

    const results: ScanResult[] = lines.map(url => evaluateUrl(url));
    const elapsed = Math.round((performance.now() - start) * 100) / 100;

    setTotalLatency(elapsed);
    setBatchResults(results);
    setIsScanning(false);
    onScanBatchComplete(results);
  };

  const clearBatch = () => {
    setInputText('');
    setBatchResults([]);
  };

  const loadDemo = () => {
    setInputText(SAMPLE_BATCH);
  };

  const filtered = batchResults.filter(r => {
    const matchesSearch = r.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.classification === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const safeCount = batchResults.filter(r => r.classification === 'SAFE').length;
  const suspiciousCount = batchResults.filter(r => r.classification === 'SUSPICIOUS').length;
  const phishingCount = batchResults.filter(r => r.classification === 'PHISHING').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Batch Input Card */}
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2937] pb-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#3B82F6]">
              Batch URL Inspection
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <Layers className="w-5 h-5 text-[#3B82F6]" />
              Check multiple URLs at once
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
              Paste one URL per line to analyze multiple links at once.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={loadDemo}
              className="px-3 py-1.5 text-xs bg-[#161B22] hover:bg-[#1F2937] text-[#D1D5DB] rounded-lg transition-colors border border-[#30363D] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Load sample list (10)</span>
            </button>
            <button
              onClick={clearBatch}
              className="px-3 py-1.5 text-xs bg-[#0B0D0F] hover:bg-[#161B22] text-[#9CA3AF] hover:text-white rounded-lg transition-colors border border-[#1F2937]"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#9CA3AF] block">
            URLs to analyze (one per line):
          </label>
          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="https://example.com&#10;http://phishing-site.xyz/login&#10;http://192.168.1.1/auth"
            className="w-full bg-[#161B22] border-2 border-[#30363D] focus:border-[#3B82F6] rounded-xl p-4 text-xs font-mono text-white placeholder-[#4B5563] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-[#9CA3AF] font-mono">
            Line count: <strong className="text-white">{inputText.split('\n').filter(l => l.trim().length > 0).length}</strong> URLs
          </div>

          <button
            onClick={handleRunBatch}
            disabled={isScanning || inputText.trim().length === 0}
            className="px-8 py-3.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isScanning ? 'Checking URLs...' : 'Check All URLs'}</span>
          </button>
        </div>
      </div>

      {/* Batch Summary Stats */}
      {batchResults.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl p-5">
              <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Total Scanned</div>
              <div className="text-3xl font-mono font-extrabold text-white mt-1">{batchResults.length}</div>
              <div className="text-[11px] text-[#6B7280] font-mono mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#3B82F6]" /> {totalLatency} ms elapsed
              </div>
            </div>

            <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl p-5">
              <div className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Likely Safe
              </div>
              <div className="text-3xl font-mono font-extrabold text-[#10B981] mt-1">{safeCount}</div>
              <div className="text-[11px] text-[#9CA3AF] font-mono mt-1">
                {Math.round((safeCount / batchResults.length) * 100)}% of total
              </div>
            </div>

            <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl p-5">
              <div className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" /> Suspicious
              </div>
              <div className="text-3xl font-mono font-extrabold text-[#F59E0B] mt-1">{suspiciousCount}</div>
              <div className="text-[11px] text-[#9CA3AF] font-mono mt-1">
                {Math.round((suspiciousCount / batchResults.length) * 100)}% of total
              </div>
            </div>

            <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl p-5">
              <div className="text-[11px] font-bold text-[#F43F5E] uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F43F5E]" /> Likely Phishing
              </div>
              <div className="text-3xl font-mono font-extrabold text-[#F43F5E] mt-1">{phishingCount}</div>
              <div className="text-[11px] text-[#9CA3AF] font-mono mt-1">
                {Math.round((phishingCount / batchResults.length) * 100)}% of total
              </div>
            </div>
          </div>

          {/* Results Table & Filters */}
          <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B0D0F]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter scanned URLs by domain or path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6] font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  {['ALL', 'SAFE', 'SUSPICIOUS', 'PHISHING'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-lg font-mono transition-all ${
                        statusFilter === status
                          ? 'bg-[#3B82F6] text-white'
                          : 'bg-[#161B22] text-[#9CA3AF] hover:text-white border border-[#30363D]'
                      }`}
                    >
                      {status === 'ALL' ? 'All' : status === 'SAFE' ? 'Safe' : status === 'SUSPICIOUS' ? 'Suspicious' : 'Phishing'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 pl-2 border-l border-[#1F2937]">
                  <button
                    onClick={() => exportScansAsCSV(batchResults)}
                    className="px-3 py-1.5 bg-[#161B22] hover:bg-[#1F2937] text-[#D1D5DB] text-xs rounded-lg border border-[#30363D] font-mono font-medium flex items-center gap-1.5"
                    title="Export as CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-[#3B82F6]" /> CSV
                  </button>
                  <button
                    onClick={() => exportScansAsJSON(batchResults)}
                    className="px-3 py-1.5 bg-[#161B22] hover:bg-[#1F2937] text-[#D1D5DB] text-xs rounded-lg border border-[#30363D] font-mono font-medium flex items-center gap-1.5"
                    title="Export as JSON"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#3B82F6]" /> JSON
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1F2937] bg-[#0F1216] text-[#6B7280] font-mono uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-5">Target URL</th>
                    <th className="p-3.5">Risk Score</th>
                    <th className="p-3.5">Verdict</th>
                    <th className="p-3.5">Protocol</th>
                    <th className="p-3.5">Entropy</th>
                    <th className="p-3.5">Keywords</th>
                    <th className="p-3.5 pr-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937] font-mono">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#6B7280] font-sans">
                        No URLs matching the search filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#161B22]/60 transition-colors">
                        <td className="p-3.5 pl-5 font-mono text-[#D1D5DB] max-w-sm truncate" title={item.url}>
                          {item.url}
                        </td>
                        <td className="p-3.5 font-bold">
                          <span className={`${
                            item.risk_score >= 65 ? 'text-[#F43F5E]' :
                            item.risk_score >= 35 ? 'text-[#F59E0B]' :
                            'text-[#10B981]'
                          }`}>
                            {Math.round(item.risk_score)} / 100
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            item.classification === 'SAFE' ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30' :
                            item.classification === 'SUSPICIOUS' ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' :
                            'bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30'
                          }`}>
                            {item.classification === 'SAFE' ? 'Likely Safe' : item.classification === 'SUSPICIOUS' ? 'Suspicious' : 'Likely Phishing'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {item.features.is_https ? (
                            <span className="text-[#10B981] font-medium">HTTPS</span>
                          ) : (
                            <span className="text-[#F43F5E] font-medium">HTTP</span>
                          )}
                        </td>
                        <td className="p-3.5 text-[#9CA3AF]">
                          {item.features.domain_entropy}
                        </td>
                        <td className="p-3.5 text-[#9CA3AF]">
                          {item.features.suspicious_keyword_count}
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          {onSelectResult && (
                            <button
                              onClick={() => onSelectResult(item)}
                              className="text-[#3B82F6] hover:underline text-xs font-sans font-medium"
                            >
                              Inspect &rarr;
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


