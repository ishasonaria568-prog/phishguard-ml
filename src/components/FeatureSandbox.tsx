import React, { useState } from 'react';
import { Sliders, Cpu, ShieldCheck, AlertTriangle, ShieldAlert, RotateCcw, Info, Zap, Sparkles } from 'lucide-react';
import { UrlFeatures } from '../types';

export const FeatureSandbox: React.FC = () => {
  const [entropy, setEntropy] = useState<number>(2.4);
  const [isIp, setIsIp] = useState<boolean>(false);
  const [isHttps, setIsHttps] = useState<boolean>(true);
  const [isShortener, setIsShortener] = useState<boolean>(false);
  const [hasAtSymbol, setHasAtSymbol] = useState<boolean>(false);
  const [hasHyphen, setHasHyphen] = useState<boolean>(false);
  const [isSuspiciousTld, setIsSuspiciousTld] = useState<boolean>(false);
  const [keywordsCount, setKeywordsCount] = useState<number>(0);
  const [subdomainsCount, setSubdomainsCount] = useState<number>(0);
  const [urlLength, setUrlLength] = useState<number>(32);

  // Compute live simulated risk
  let score = 8.0;
  const triggers: { label: string; impact: string; type: 'danger' | 'warning' | 'safe'; explanation: string }[] = [];

  if (isIp) {
    score += 45.0;
    triggers.push({ 
      label: 'Direct IP Address', 
      impact: '+45%', 
      type: 'danger',
      explanation: 'Using raw numbers instead of a real brand name is a major red flag.'
    });
  }

  if (keywordsCount > 0) {
    const kwImpact = Math.min(keywordsCount * 14.0, 38.0);
    score += kwImpact;
    triggers.push({ 
      label: `Suspicious Keywords (${keywordsCount})`, 
      impact: `+${Math.round(kwImpact)}%`, 
      type: 'danger',
      explanation: 'Words like "login", "verify", or "bank" often lure victims.'
    });
  }

  if (!isHttps) {
    score += 16.0;
    triggers.push({ 
      label: 'Unencrypted HTTP Protocol', 
      impact: '+16%', 
      type: 'warning',
      explanation: 'Lacks basic encryption, meaning communications can be intercepted.'
    });
  } else {
    score -= 6.0;
    triggers.push({ 
      label: 'HTTPS Enabled', 
      impact: '-6%', 
      type: 'safe',
      explanation: 'Traffic is encrypted (though attackers can also use free SSL).'
    });
  }

  if (isSuspiciousTld) {
    score += 24.0;
    triggers.push({ 
      label: 'High-Risk Domain Extension (.xyz, .top, .click)', 
      impact: '+24%', 
      type: 'danger',
      explanation: 'Often favored by spammers due to low cost and loose verification.'
    });
  }

  if (entropy > 3.4) {
    score += 22.0;
    triggers.push({ 
      label: `Random / Gibberish Domain (${entropy.toFixed(2)} entropy)`, 
      impact: '+22%', 
      type: 'danger',
      explanation: 'High randomness indicates automated domain generation (DGA).'
    });
  } else if (entropy > 3.0) {
    score += 9.0;
    triggers.push({ 
      label: `Elevated Character Randomness (${entropy.toFixed(2)})`, 
      impact: '+9%', 
      type: 'warning',
      explanation: 'Somewhat random sequence of characters.'
    });
  }

  if (hasHyphen) {
    score += 16.0;
    triggers.push({ 
      label: 'Hyphenated Name (Brand Impersonation)', 
      impact: '+16%', 
      type: 'warning',
      explanation: 'e.g. "paypal-security" trying to trick users into trusting it.'
    });
  }

  if (subdomainsCount >= 2) {
    score += 18.0;
    triggers.push({ 
      label: `Multiple Subdomains (${subdomainsCount} levels)`, 
      impact: '+18%', 
      type: 'warning',
      explanation: 'Fake prefixes stacked in front of an unrelated root domain.'
    });
  }

  if (isShortener) {
    score += 22.0;
    triggers.push({ 
      label: 'URL Shortener (Hidden Destination)', 
      impact: '+22%', 
      type: 'warning',
      explanation: 'Shortened links hide where you will actually land.'
    });
  }

  if (hasAtSymbol) {
    score += 35.0;
    triggers.push({ 
      label: '@ Symbol in URL', 
      impact: '+35%', 
      type: 'danger',
      explanation: 'Browsers ignore anything before "@", sending you to the domain after.'
    });
  }

  if (urlLength > 75) {
    score += 14.0;
    triggers.push({ 
      label: `Excessively Long Link (${urlLength} characters)`, 
      impact: '+14%', 
      type: 'warning',
      explanation: 'Attackers frequently use long strings to bury suspicious patterns.'
    });
  }

  const finalScore = Math.round(Math.max(0, Math.min(100, score)) * 10) / 10;
  const classification = finalScore >= 65 ? 'PHISHING' : finalScore >= 35 ? 'SUSPICIOUS' : 'SAFE';

  const resetToClean = () => {
    setEntropy(2.4);
    setIsIp(false);
    setIsHttps(true);
    setIsShortener(false);
    setHasAtSymbol(false);
    setHasHyphen(false);
    setIsSuspiciousTld(false);
    setKeywordsCount(0);
    setSubdomainsCount(0);
    setUrlLength(32);
  };

  const loadPhishingProfile = () => {
    setEntropy(3.75);
    setIsIp(false);
    setIsHttps(false);
    setIsShortener(false);
    setHasAtSymbol(false);
    setHasHyphen(true);
    setIsSuspiciousTld(true);
    setKeywordsCount(3);
    setSubdomainsCount(2);
    setUrlLength(84);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2937] pb-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#3B82F6]">
              Interactive Learning Sandbox
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <Sliders className="w-5 h-5 text-[#3B82F6]" />
              URL Feature Simulator
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
              Adjust different link characteristics to see in real-time how the Machine Learning model calculates phishing risk.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={resetToClean}
              className="px-3.5 py-1.5 text-xs bg-[#161B22] hover:bg-[#1F2937] text-[#D1D5DB] rounded-lg transition-colors border border-[#30363D] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Normal URL</span>
            </button>
            <button
              onClick={loadPhishingProfile}
              className="px-3.5 py-1.5 text-xs bg-[#F43F5E]/15 hover:bg-[#F43F5E]/25 text-[#F43F5E] rounded-lg transition-colors border border-[#F43F5E]/30 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Phishing Profile</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Output Card */}
        <div className="p-6 rounded-2xl bg-[#0B0D0F] border border-[#1F2937] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-[#1F2937]" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={finalScore >= 65 ? '#F43F5E' : finalScore >= 35 ? '#F59E0B' : '#10B981'}
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * finalScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-mono text-white">{Math.round(finalScore)}%</span>
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Risk</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-[#9CA3AF]">Simulated Model Output:</div>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs uppercase border ${
                classification === 'SAFE' ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30' :
                classification === 'SUSPICIOUS' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30' :
                'bg-[#F43F5E]/20 text-[#F43F5E] border-[#F43F5E]/30'
              }`}>
                {classification === 'SAFE' && <ShieldCheck className="w-4 h-4" />}
                {classification === 'SUSPICIOUS' && <AlertTriangle className="w-4 h-4" />}
                {classification === 'PHISHING' && <ShieldAlert className="w-4 h-4" />}
                <span>
                  {classification === 'SAFE' ? 'Likely Safe' : classification === 'SUSPICIOUS' ? 'Suspicious Risk' : 'High Phishing Risk'}
                </span>
              </div>
              <div className="text-xs text-[#6B7280]">
                Active signals: <strong className="text-white font-mono">{triggers.length}</strong> rules affecting score
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 max-w-md justify-center md:justify-end">
            {triggers.map((t, i) => (
              <span
                key={i}
                title={t.explanation}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-help transition-all ${
                  t.type === 'danger' ? 'bg-[#F43F5E]/15 border-[#F43F5E]/30 text-[#F43F5E]' :
                  t.type === 'warning' ? 'bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]' :
                  'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                }`}
              >
                {t.label} <strong>({t.impact})</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Feature Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* Entropy Slider */}
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">Domain Randomness (Entropy)</span>
              <span className="text-[#3B82F6] font-mono font-bold">{entropy.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.5"
              step="0.05"
              value={entropy}
              onChange={(e) => setEntropy(parseFloat(e.target.value))}
              className="w-full accent-[#3B82F6] cursor-pointer"
            />
            <p className="text-[11px] text-[#9CA3AF]">
              Normal domain names have 2.0 - 2.8. Random strings score higher.
            </p>
          </div>

          {/* Keywords Count */}
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">Suspicious Keywords</span>
              <span className="text-[#F59E0B] font-mono font-bold">{keywordsCount} found</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={keywordsCount}
              onChange={(e) => setKeywordsCount(parseInt(e.target.value))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
            <p className="text-[11px] text-[#9CA3AF]">
              Triggers on words like: "login", "verify", "secure", "account".
            </p>
          </div>

          {/* Subdomains Count */}
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">Subdomain Stacking</span>
              <span className="text-[#3B82F6] font-mono font-bold">{subdomainsCount} levels</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={subdomainsCount}
              onChange={(e) => setSubdomainsCount(parseInt(e.target.value))}
              className="w-full accent-[#3B82F6] cursor-pointer"
            />
            <p className="text-[11px] text-[#9CA3AF]">
              Attackers stack subdomains like "paypal.com.account-verify.xyz".
            </p>
          </div>

          {/* URL Length */}
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white">URL Length</span>
              <span className="text-[#10B981] font-mono font-bold">{urlLength} chars</span>
            </div>
            <input
              type="range"
              min="15"
              max="150"
              step="1"
              value={urlLength}
              onChange={(e) => setUrlLength(parseInt(e.target.value))}
              className="w-full accent-[#10B981] cursor-pointer"
            />
            <p className="text-[11px] text-[#9CA3AF]">
              Normal links are &lt; 60 chars. Long links often hide redirects.
            </p>
          </div>

          {/* Boolean Toggles */}
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-3 col-span-1 md:col-span-2">
            <span className="text-xs font-bold text-white block">
              URL Red Flag Checkboxes
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] cursor-pointer hover:border-[#3B82F6] transition-colors">
                <input
                  type="checkbox"
                  checked={isHttps}
                  onChange={(e) => setIsHttps(e.target.checked)}
                  className="rounded accent-[#10B981] w-4 h-4 cursor-pointer"
                />
                <span className="text-white font-medium">HTTPS Active</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] cursor-pointer hover:border-[#3B82F6] transition-colors">
                <input
                  type="checkbox"
                  checked={isIp}
                  onChange={(e) => setIsIp(e.target.checked)}
                  className="rounded accent-[#F43F5E] w-4 h-4 cursor-pointer"
                />
                <span className="text-white font-medium">Raw IP Address</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] cursor-pointer hover:border-[#3B82F6] transition-colors">
                <input
                  type="checkbox"
                  checked={isShortener}
                  onChange={(e) => setIsShortener(e.target.checked)}
                  className="rounded accent-[#F59E0B] w-4 h-4 cursor-pointer"
                />
                <span className="text-white font-medium">URL Shortener</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] cursor-pointer hover:border-[#3B82F6] transition-colors">
                <input
                  type="checkbox"
                  checked={hasAtSymbol}
                  onChange={(e) => setHasAtSymbol(e.target.checked)}
                  className="rounded accent-[#F43F5E] w-4 h-4 cursor-pointer"
                />
                <span className="text-white font-medium">"@" Symbol in URL</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] cursor-pointer hover:border-[#3B82F6] transition-colors">
                <input
                  type="checkbox"
                  checked={hasHyphen}
                  onChange={(e) => setHasHyphen(e.target.checked)}
                  className="rounded accent-[#F59E0B] w-4 h-4 cursor-pointer"
                />
                <span className="text-white font-medium">Hyphenated Name</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] cursor-pointer hover:border-[#3B82F6] transition-colors">
                <input
                  type="checkbox"
                  checked={isSuspiciousTld}
                  onChange={(e) => setIsSuspiciousTld(e.target.checked)}
                  className="rounded accent-[#F43F5E] w-4 h-4 cursor-pointer"
                />
                <span className="text-white font-medium">High-Abuse Domain (.xyz)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


