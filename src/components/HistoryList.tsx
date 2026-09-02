import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  FileText,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ScanResult, RiskClassification } from '../types';
import { exportScansAsCSV, exportScansAsJSON } from '../lib/storage';

interface HistoryListProps {
  history: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelectScan, onClearHistory }) => {
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = history.filter(item => {
    const matchesSearch = item.url.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || item.classification === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2937] pb-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-[#3B82F6]">
            Local Scan Records
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
            <History className="w-5 h-5 text-[#3B82F6]" />
            Your Scan History
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
            URLs previously checked on this device. Stored locally in your browser for privacy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {history.length > 0 && (
            <>
              <button
                onClick={() => exportScansAsCSV(history)}
                className="px-3 py-1.5 text-xs bg-[#161B22] hover:bg-[#1F2937] text-[#D1D5DB] rounded-lg transition-colors border border-[#30363D] flex items-center gap-1.5"
                title="Export history as CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#3B82F6]" /> CSV
              </button>
              <button
                onClick={() => exportScansAsJSON(history)}
                className="px-3 py-1.5 text-xs bg-[#161B22] hover:bg-[#1F2937] text-[#D1D5DB] rounded-lg transition-colors border border-[#30363D] flex items-center gap-1.5"
                title="Export history as JSON"
              >
                <FileText className="w-3.5 h-3.5 text-[#3B82F6]" /> JSON
              </button>
              <button
                onClick={onClearHistory}
                className="px-3 py-1.5 text-xs bg-[#F43F5E]/15 hover:bg-[#F43F5E]/25 text-[#F43F5E] rounded-lg transition-colors border border-[#F43F5E]/30 font-medium flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter past scans by URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#161B22] border border-[#30363D] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6] font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'SAFE', 'SUSPICIOUS', 'PHISHING'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg font-mono transition-all ${
                filter === f
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#161B22] text-[#9CA3AF] hover:text-white border border-[#30363D]'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'SAFE' ? 'Safe' : f === 'SUSPICIOUS' ? 'Suspicious' : 'Phishing'}
            </button>
          ))}
        </div>
      </div>

      {/* History Items Table */}
      <div className="bg-[#0B0D0F] border border-[#1F2937] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#161B22] border border-[#1F2937] flex items-center justify-center mx-auto text-[#6B7280]">
              <History className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">No scans recorded yet</p>
            <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto">
              Scan any web link using the detector to save a private verification log here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1F2937] bg-[#0F1216] text-[#6B7280] uppercase tracking-wider text-[10px] font-mono">
                  <th className="p-3.5 pl-4">Scanned URL</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Verdict</th>
                  <th className="p-3.5">Protocol</th>
                  <th className="p-3.5">Entropy</th>
                  <th className="p-3.5">Time</th>
                  <th className="p-3.5 pr-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937] font-mono">
                {filtered.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => onSelectScan(item)}
                    className="hover:bg-[#161B22]/70 transition-colors cursor-pointer group"
                  >
                    <td className="p-3.5 pl-4 text-[#D1D5DB] max-w-sm truncate group-hover:text-[#3B82F6]">
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
                      <span className={item.features.is_https ? 'text-[#10B981]' : 'text-[#F43F5E]'}>
                        {item.features.is_https ? 'HTTPS' : 'HTTP'}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#9CA3AF]">
                      {item.features.domain_entropy}
                    </td>
                    <td className="p-3.5 text-[#6B7280] text-[11px]">
                      {new Date(item.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 pr-4 text-right text-[#6B7280] group-hover:text-[#3B82F6]">
                      <ArrowRight className="w-4 h-4 inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};


