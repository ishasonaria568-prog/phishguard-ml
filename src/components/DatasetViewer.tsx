import React, { useState } from 'react';
import { 
  BarChart3, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Activity, 
  Layers, 
  FileSpreadsheet, 
  ShieldAlert, 
  ShieldCheck,
  TrendingUp,
  Download
} from 'lucide-react';
import { MODEL_METRICS } from '../lib/mlModel';

const DATASET_SAMPLES = [
  { url: 'https://www.google.com', length: 22, entropy: 2.32, is_ip: 0, is_https: 1, keywords: 0, subdomains: 1, label: 0 },
  { url: 'https://github.com/torvalds/linux', length: 33, entropy: 2.72, is_ip: 0, is_https: 1, keywords: 0, subdomains: 0, label: 0 },
  { url: 'http://paypal-security-verification.xyz/login/verify.php', length: 68, entropy: 3.84, is_ip: 0, is_https: 0, keywords: 3, subdomains: 0, label: 1 },
  { url: 'http://192.168.1.100/auth/bankofamerica/secure-login.html', length: 55, entropy: 2.45, is_ip: 1, is_https: 0, keywords: 3, subdomains: 0, label: 1 },
  { url: 'https://docs.python.org/3/library/', length: 34, entropy: 2.58, is_ip: 0, is_https: 1, keywords: 0, subdomains: 1, label: 0 },
  { url: 'http://apple-id-verify-account.top/manage/signin.php', length: 51, entropy: 3.71, is_ip: 0, is_https: 0, keywords: 4, subdomains: 0, label: 1 },
  { url: 'http://bit.ly/secure-login-39281', length: 31, entropy: 2.25, is_ip: 0, is_https: 0, keywords: 2, subdomains: 0, label: 1 },
  { url: 'https://www.microsoft.com/en-us/', length: 32, entropy: 2.69, is_ip: 0, is_https: 1, keywords: 0, subdomains: 1, label: 0 },
  { url: 'http://netflix-billing-suspended.gq/login?user=test', length: 58, entropy: 3.48, is_ip: 0, is_https: 0, keywords: 2, subdomains: 0, label: 1 },
  { url: 'https://developer.mozilla.org/en-US/', length: 36, entropy: 2.78, is_ip: 0, is_https: 1, keywords: 0, subdomains: 1, label: 0 }
];

export const DatasetViewer: React.FC = () => {
  const [filterLabel, setFilterLabel] = useState<string>('ALL');

  const filteredSamples = DATASET_SAMPLES.filter(s => {
    if (filterLabel === 'LEGIT') return s.label === 0;
    if (filterLabel === 'PHISH') return s.label === 1;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview & Free Tech Header */}
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2937] pb-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">
              Evaluation &amp; Corpus Metrics
            </div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
              <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
              Machine Learning Model &amp; Public Training Dataset
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded bg-[#161B22] text-[#9CA3AF] border border-[#30363D] font-mono font-medium">
              Artifact: <strong className="text-white">phishing_classifier.joblib</strong>
            </span>
          </div>
        </div>

        {/* Evaluation Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          <div className="p-4 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[#6B7280] text-[10px] uppercase font-bold tracking-wider font-sans">Accuracy</div>
            <div className="text-2xl font-light text-[#10B981] mt-1">{(MODEL_METRICS.accuracy * 100).toFixed(1)}%</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Test Partition</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[#6B7280] text-[10px] uppercase font-bold tracking-wider font-sans">ROC-AUC</div>
            <div className="text-2xl font-light text-[#3B82F6] mt-1">{MODEL_METRICS.roc_auc.toFixed(3)}</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Area Under Curve</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[#6B7280] text-[10px] uppercase font-bold tracking-wider font-sans">Precision</div>
            <div className="text-2xl font-light text-[#10B981] mt-1">{(MODEL_METRICS.precision * 100).toFixed(1)}%</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Low False Positives</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[#6B7280] text-[10px] uppercase font-bold tracking-wider font-sans">Recall</div>
            <div className="text-2xl font-light text-[#3B82F6] mt-1">{(MODEL_METRICS.recall * 100).toFixed(1)}%</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Catch Rate</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[#6B7280] text-[10px] uppercase font-bold tracking-wider font-sans">F1-Score</div>
            <div className="text-2xl font-light text-[#F59E0B] mt-1">{(MODEL_METRICS.f1_score * 100).toFixed(1)}%</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Harmonic Mean</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[#6B7280] text-[10px] uppercase font-bold tracking-wider font-sans">5-Fold CV</div>
            <div className="text-2xl font-light text-[#3B82F6] mt-1">{(MODEL_METRICS.cv_score * 100).toFixed(1)}%</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Stratified K-Fold</div>
          </div>
        </div>

        {/* Feature Importance Bar Chart & Confusion Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Feature Importances (2 cols) */}
          <div className="lg:col-span-2 p-5 rounded-lg bg-[#0B0D0F] border border-[#1F2937] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#3B82F6]" />
                Random Forest Feature Importance Weights (Gini Impurity)
              </h3>
              <span className="text-[10px] text-[#6B7280] font-mono">11 primary features</span>
            </div>

            <div className="space-y-3">
              {MODEL_METRICS.feature_importances.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#D1D5DB] flex items-center gap-2">
                      <span className="text-[#6B7280] text-[10px]">#{idx + 1}</span>
                      {item.label}
                    </span>
                    <span className="text-[#3B82F6] font-bold">
                      {(item.importance * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#161B22] rounded h-1.5 overflow-hidden border border-[#30363D]">
                    <div
                      className="bg-[#3B82F6] h-full rounded transition-all duration-500"
                      style={{ width: `${(item.importance / 0.25) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confusion Matrix & Hardware Efficiency */}
          <div className="space-y-4">
            <div className="p-5 rounded-lg bg-[#0B0D0F] border border-[#1F2937] space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
                Confusion Matrix (Test Split)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs pt-1">
                <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25">
                  <div className="text-[9px] text-[#10B981] font-sans font-bold uppercase">TRUE NEGATIVE</div>
                  <div className="text-lg font-bold text-[#10B981] mt-1">6,730</div>
                  <div className="text-[10px] text-[#6B7280]">Correctly clean</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F43F5E]/10 border border-[#F43F5E]/25">
                  <div className="text-[9px] text-[#F43F5E] font-sans font-bold uppercase">FALSE POSITIVE</div>
                  <div className="text-lg font-bold text-[#F43F5E] mt-1">194</div>
                  <div className="text-[10px] text-[#6B7280]">Clean as threat</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F43F5E]/10 border border-[#F43F5E]/25">
                  <div className="text-[9px] text-[#F43F5E] font-sans font-bold uppercase">FALSE NEGATIVE</div>
                  <div className="text-lg font-bold text-[#F43F5E] mt-1">242</div>
                  <div className="text-[10px] text-[#6B7280]">Missed threat</div>
                </div>
                <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25">
                  <div className="text-[9px] text-[#10B981] font-sans font-bold uppercase">TRUE POSITIVE</div>
                  <div className="text-lg font-bold text-[#10B981] mt-1">6,384</div>
                  <div className="text-[10px] text-[#6B7280]">Blocked attack</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0B0D0F] border border-[#1F2937] text-xs space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" />
                Lightweight Inference Specs
              </div>
              <ul className="space-y-1 text-[#9CA3AF] font-mono text-[11px]">
                <li>• Model size on disk: <strong className="text-white">1.8 MB</strong></li>
                <li>• RAM usage at runtime: <strong className="text-white">&lt; 35 MB</strong></li>
                <li>• Average inference time: <strong className="text-[#10B981]">&lt; 2.5 ms</strong></li>
                <li>• Training time (54k URLs): <strong className="text-white">~ 8.2 seconds</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Curated Dataset Table */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#3B82F6]" />
              Public Training Dataset Explorer (phishing_dataset.csv)
            </h3>
            <div className="flex items-center gap-1">
              {['ALL', 'LEGIT', 'PHISH'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterLabel(f)}
                  className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold rounded transition-all ${
                    filterLabel === f
                      ? 'bg-[#3B82F6] text-white'
                      : 'bg-[#161B22] text-[#9CA3AF] hover:text-white border border-[#30363D]'
                  }`}
                >
                  {f === 'ALL' ? 'All' : f === 'LEGIT' ? 'Legitimate' : 'Phishing'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0B0D0F] border border-[#1F2937] rounded-lg overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1F2937] bg-[#0F1216] text-[#6B7280] uppercase tracking-wider text-[10px]">
                  <th className="p-3 pl-4">Sample URL</th>
                  <th className="p-3">Length</th>
                  <th className="p-3">Entropy</th>
                  <th className="p-3">Direct IP</th>
                  <th className="p-3">HTTPS</th>
                  <th className="p-3">Keywords</th>
                  <th className="p-3">Subdomains</th>
                  <th className="p-3">Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {filteredSamples.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#161B22]/50 transition-colors">
                    <td className="p-3 pl-4 text-[#D1D5DB] max-w-xs truncate" title={s.url}>
                      {s.url}
                    </td>
                    <td className="p-3 text-[#9CA3AF]">{s.length}</td>
                    <td className="p-3 text-white font-bold">{s.entropy}</td>
                    <td className="p-3">
                      <span className={s.is_ip ? 'text-[#F43F5E] font-bold' : 'text-[#6B7280]'}>
                        {s.is_ip ? '1 (IP)' : '0'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={s.is_https ? 'text-[#10B981] font-semibold' : 'text-[#F43F5E]'}>
                        {s.is_https ? '1 (HTTPS)' : '0 (HTTP)'}
                      </span>
                    </td>
                    <td className="p-3 text-[#9CA3AF]">{s.keywords}</td>
                    <td className="p-3 text-[#9CA3AF]">{s.subdomains}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        s.label === 0 ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30' :
                        'bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30'
                      }`}>
                        {s.label === 0 ? '0 (Clean)' : '1 (Phish)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

