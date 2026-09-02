import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Copy, 
  Check, 
  Zap, 
  Clock, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lock,
  Globe,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Shield,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScanResult, PresetURL } from '../types';
import { evaluateUrl } from '../lib/mlModel';
import { UrlAnatomy } from './UrlAnatomy';

interface SingleScannerProps {
  onScanComplete: (result: ScanResult) => void;
  latestScan: ScanResult | null;
  historyCount?: number;
  onNavigateToTab?: (tab: any) => void;
}

export const SingleScanner: React.FC<SingleScannerProps> = ({ 
  onScanComplete, 
  latestScan,
  historyCount = 0,
  onNavigateToTab
}) => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(latestScan);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  // Sync latestScan when passed from props (e.g. when selected from history)
  useEffect(() => {
    if (latestScan) {
      setCurrentResult(latestScan);
      setInputUrl(latestScan.url);
    }
  }, [latestScan]);

  const validateUrl = (url: string): { valid: boolean; error?: string } => {
    const trimmed = url.trim();
    if (!trimmed) {
      return { 
        valid: false, 
        error: "Please enter a web address to check (e.g. https://example.com)." 
      };
    }
    if (trimmed.length > 2048) {
      return { 
        valid: false, 
        error: "The URL exceeds the maximum allowed length (2048 characters)." 
      };
    }
    // Reject strings with internal spaces
    if (/\s/.test(trimmed)) {
      return {
        valid: false,
        error: "That doesn't look like a valid URL. Try something like: https://example.com"
      };
    }

    let toParse = trimmed;
    if (!/^https?:\/\//i.test(toParse)) {
      toParse = 'http://' + toParse;
    }

    try {
      const parsed = new URL(toParse);
      const host = parsed.hostname;
      if (!host) {
        return {
          valid: false,
          error: "That doesn't look like a valid URL. Try something like: https://example.com"
        };
      }
      const isIp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(host);
      const isLocalhost = host === 'localhost';
      const hasDot = host.includes('.');

      if (!isIp && !isLocalhost && !hasDot) {
        return {
          valid: false,
          error: "That doesn't look like a valid URL. Try something like: https://example.com"
        };
      }

      if (host.startsWith('.') || host.endsWith('.')) {
        return {
          valid: false,
          error: "That doesn't look like a valid URL. Try something like: https://example.com"
        };
      }

      return { valid: true };
    } catch {
      return {
        valid: false,
        error: "That doesn't look like a valid URL. Try something like: https://example.com"
      };
    }
  };

  const handleScan = (targetUrl?: string) => {
    const toScan = (targetUrl !== undefined ? targetUrl : inputUrl).trim();
    setErrorMessage(null);

    const validation = validateUrl(toScan);
    if (!validation.valid) {
      setErrorMessage(validation.error || "That doesn't look like a valid URL. Try something like: https://example.com");
      return;
    }

    // Friendly quick progressive loading state
    setIsAnalyzing(true);
    setAnalysisStep(1);

    setTimeout(() => {
      setAnalysisStep(2);
    }, 120);

    setTimeout(() => {
      setAnalysisStep(3);
    }, 240);

    setTimeout(() => {
      const result = evaluateUrl(toScan);
      setCurrentResult(result);
      onScanComplete(result);
      setIsAnalyzing(false);
      setAnalysisStep(0);

      if (result.classification === 'SAFE') {
        try {
          confetti({
            particleCount: 25,
            spread: 45,
            origin: { y: 0.65 }
          });
        } catch {
          //
        }
      }
    }, 360);
  };

  const handlePaste = async () => {
    setErrorMessage(null);
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text.trim());
        handleScan(text.trim());
      }
    } catch {
      // If clipboard permission denied, focus input
      const el = document.getElementById('url-scan-input');
      if (el) el.focus();
    }
  };

  const handleDemoSelect = (demoUrl: string) => {
    setInputUrl(demoUrl);
    handleScan(demoUrl);
  };

  const handleClear = () => {
    setInputUrl('');
    setCurrentResult(null);
    setErrorMessage(null);
  };

  const copyReport = () => {
    if (!currentResult) return;
    const md = `### 🛡️ PhishGuard Security Scan Report
- **URL**: ${currentResult.url}
- **Verdict**: ${
      currentResult.classification === 'SAFE' ? 'Likely Safe' :
      currentResult.classification === 'SUSPICIOUS' ? 'Suspicious' :
      'Likely Phishing'
    }
- **Risk Score**: ${currentResult.risk_score} / 100
- **Confidence**: ${(currentResult.confidence * 100).toFixed(0)}%
- **Analysis Mode**: 100% Local Machine Learning (No URL opened)
- **Timestamp**: ${new Date(currentResult.scanned_at).toUTCString()}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert technical rules into friendly human statements for "Why did we flag this?"
  const getHumanFriendlyFindings = (res: ScanResult) => {
    const findings: { icon: string; title: string; desc: string; type: 'safe' | 'warning' | 'danger' }[] = [];

    // Protocol check
    if (res.features.is_https) {
      findings.push({
        icon: '✓',
        title: 'Uses HTTPS encryption',
        desc: 'The link connects over a secure, encrypted connection (TLS/SSL).',
        type: 'safe'
      });
    } else {
      findings.push({
        icon: '⚠',
        title: 'Unencrypted connection (Plain HTTP)',
        desc: 'This link does not use HTTPS encryption, leaving data exposed in transit.',
        type: 'warning'
      });
    }

    // IP Hostname
    if (res.features.is_ip_address) {
      findings.push({
        icon: '🚨',
        title: 'Uses an IP address instead of a domain name',
        desc: 'The URL uses numerical digits rather than a registered website name, which is common in phishing.',
        type: 'danger'
      });
    }

    // Suspicious keywords
    if (res.features.suspicious_keyword_count > 0) {
      findings.push({
        icon: '⚠',
        title: 'Contains login or urgency keywords',
        desc: `Found keywords: [${res.features.extracted_keywords?.join(', ')}]. Phishing links often include words like login, verify, or security.`,
        type: 'danger'
      });
    }

    // Subdomains
    if (res.features.num_subdomains >= 2) {
      findings.push({
        icon: '⚠',
        title: 'Multiple subdomain levels',
        desc: 'The link stacks several subdomains, a technique often used to disguise the real destination.',
        type: 'warning'
      });
    }

    // Hyphens
    if (res.features.has_prefix_suffix_hyphen) {
      findings.push({
        icon: '⚠',
        title: 'Unusual domain structure with hyphens',
        desc: 'The domain uses hyphens to simulate well-known brand names (e.g., brand-support).',
        type: 'warning'
      });
    }

    // High entropy / random domain
    if (res.features.domain_entropy > 3.4) {
      findings.push({
        icon: '⚠',
        title: 'Unusual, random-looking domain name',
        desc: 'The domain name characters look machine-generated rather than like a standard brand name.',
        type: 'danger'
      });
    }

    // Suspicious TLD
    if (res.features.is_suspicious_tld) {
      findings.push({
        icon: '⚠',
        title: `High-risk domain extension (.${res.features.tld})`,
        desc: `The .${res.features.tld} extension is frequently used in disposable scam and spam campaigns.`,
        type: 'danger'
      });
    }

    // URL Shortener
    if (res.features.is_shortener) {
      findings.push({
        icon: '⚠',
        title: 'Shortened link disguising destination',
        desc: 'This is a shortened URL service which conceals the actual website you are visiting.',
        type: 'warning'
      });
    }

    // If nothing flagged except HTTPS
    if (findings.length === 1 && findings[0].type === 'safe') {
      findings.push({
        icon: '✓',
        title: 'Standard domain structure',
        desc: 'The domain name matches regular formatting and passed all static phishing heuristics.',
        type: 'safe'
      });
      findings.push({
        icon: '✓',
        title: 'No deceptive keywords detected',
        desc: 'No urgent credential, banking, or verification bait words were found in the path.',
        type: 'safe'
      });
    }

    return findings;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Header Hero / Explanation */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs text-[#9CA3AF]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span>100% Free &amp; Offline Machine Learning</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          Check whether a link looks safe or suspicious.
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
          PhishGuard uses a local machine-learning model to analyze URL patterns without opening the website.
        </p>

        {/* Small Trust Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs text-[#D1D5DB]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Runs locally</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>No URL is opened</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>No API key required</span>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY URL SCANNER CARD (Largest & most visually important component) */}
      <div className="bg-[#0F1216] border-2 border-[#1F2937] hover:border-[#3B82F6]/50 transition-colors rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Search className="w-5 h-5 text-[#3B82F6]" />
              Check a link
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
              Paste a URL below and we'll analyze its structure for phishing indicators.
            </p>
          </div>
          {currentResult && (
            <button
              onClick={handleClear}
              className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1 self-start sm:self-auto py-1 px-2.5 rounded bg-[#161B22] border border-[#30363D]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleScan(); }}
          className="space-y-3"
        >
          <div className="relative flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                id="url-scan-input"
                type="text"
                value={inputUrl}
                onChange={(e) => { setInputUrl(e.target.value); setErrorMessage(null); }}
                placeholder="https://example.com/login"
                className="w-full bg-[#161B22] border-2 border-[#30363D] focus:border-[#3B82F6] rounded-xl py-4 pl-4 pr-24 text-white text-base font-mono placeholder-[#4B5563] focus:outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold bg-[#1F2937] hover:bg-[#374151] text-[#D1D5DB] rounded-lg transition-colors border border-white/5 flex items-center gap-1"
                title="Paste from clipboard"
              >
                Paste
              </button>
            </div>

            <button
              type="submit"
              id="check-url-btn"
              disabled={isAnalyzing}
              className="px-8 py-4 bg-[#3B82F6] hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Check URL'}</span>
            </button>
          </div>

          {/* Validation / Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-xs text-[#F43F5E] flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>

        {/* Loading Progress Feedback */}
        {isAnalyzing && (
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-2.5 animate-pulse">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <span className="font-semibold text-white">Analyzing URL structure...</span>
              <span className="font-mono text-[11px] text-[#3B82F6]">Local Model Running</span>
            </div>
            <div className="w-full bg-[#161B22] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#3B82F6] h-full rounded-full transition-all duration-300"
                style={{ width: `${analysisStep * 33.3}%` }}
              />
            </div>
            <div className="text-[11px] text-[#6B7280] font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping"></span>
              {analysisStep === 1 && 'Checking URL structure & protocol...'}
              {analysisStep === 2 && 'Extracting 16 security-related features...'}
              {analysisStep === 3 && 'Evaluating risk score & generating assessment...'}
            </div>
          </div>
        )}
      </div>

      {/* 3. RESULT VIEW (When a scan completes) */}
      {currentResult && !isAnalyzing && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Verdict Card */}
          <div className={`p-6 sm:p-8 rounded-2xl border-2 shadow-2xl relative overflow-hidden ${
            currentResult.classification === 'SAFE' 
              ? 'bg-[#0B1511] border-[#10B981]/40' 
              : currentResult.classification === 'SUSPICIOUS'
              ? 'bg-[#18130B] border-[#F59E0B]/40'
              : 'bg-[#180C0E] border-[#F43F5E]/40'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Verdict & Human Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  {currentResult.classification === 'SAFE' && (
                    <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                  )}
                  {currentResult.classification === 'SUSPICIOUS' && (
                    <div className="p-2 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                  )}
                  {currentResult.classification === 'PHISHING' && (
                    <div className="p-2 rounded-xl bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/40">
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                      Analysis Verdict
                    </span>
                    <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      currentResult.classification === 'SAFE' ? 'text-[#10B981]' :
                      currentResult.classification === 'SUSPICIOUS' ? 'text-[#F59E0B]' :
                      'text-[#F43F5E]'
                    }`}>
                      {currentResult.classification === 'SAFE' && 'LIKELY SAFE'}
                      {currentResult.classification === 'SUSPICIOUS' && 'SUSPICIOUS'}
                      {currentResult.classification === 'PHISHING' && 'LIKELY PHISHING'}
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#D1D5DB] font-medium pt-1 max-w-xl">
                  {currentResult.classification === 'SAFE' && "We didn't find major phishing indicators in this URL."}
                  {currentResult.classification === 'SUSPICIOUS' && "This URL contains some unusual patterns. Consider verifying the sender before opening it."}
                  {currentResult.classification === 'PHISHING' && "We found several warning signs commonly associated with phishing."}
                </p>

                {/* Scanned URL Pill */}
                <div className="pt-2">
                  <span className="text-[11px] text-[#9CA3AF] font-medium mr-2">Analyzed link:</span>
                  <span className="font-mono text-xs text-white bg-[#0B0D0F] border border-[#1F2937] px-3 py-1 rounded-lg break-all inline-block select-all">
                    {currentResult.url}
                  </span>
                </div>
              </div>

              {/* Risk Score & Confidence Gauge Box */}
              <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl p-5 flex flex-col items-center justify-center min-w-[200px] text-center shrink-0">
                <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  Risk Score
                </span>
                <div className={`text-4xl sm:text-5xl font-extrabold font-mono my-1 ${
                  currentResult.risk_score >= 65 ? 'text-[#F43F5E]' :
                  currentResult.risk_score >= 35 ? 'text-[#F59E0B]' :
                  'text-[#10B981]'
                }`}>
                  {Math.round(currentResult.risk_score)}
                  <span className="text-xl font-normal text-[#9CA3AF]"> / 100</span>
                </div>

                <div className="text-xs text-[#9CA3AF] font-mono mt-1">
                  Confidence: <strong className="text-white">{(currentResult.confidence * 100).toFixed(0)}%</strong>
                </div>

                <div className="text-[11px] text-[#6B7280] font-mono mt-1">
                  Latency: {currentResult.latency_ms} ms
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={copyReport}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#161B22] hover:bg-[#1F2937] text-white border border-[#30363D] transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Report Copied' : 'Copy Report'}</span>
                </button>
              </div>

              <div className="text-xs text-[#9CA3AF] italic">
                Probabilistic machine learning evaluation. Never share sensitive passwords on unverified sites.
              </div>
            </div>
          </div>

          {/* 4. WHY DID WE FLAG THIS? SECTION */}
          <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl p-6 shadow-xl space-y-4">
            <div className="border-b border-[#1F2937] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#3B82F6]" />
                Why did we flag this?
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Key structural signals identified during URL inspection:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getHumanFriendlyFindings(currentResult).map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    item.type === 'danger' ? 'bg-[#F43F5E]/10 border-[#F43F5E]/25' :
                    item.type === 'warning' ? 'bg-[#F59E0B]/10 border-[#F59E0B]/25' :
                    'bg-[#10B981]/10 border-[#10B981]/25'
                  }`}
                >
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                    item.type === 'danger' ? 'bg-[#F43F5E]/20 text-[#F43F5E]' :
                    item.type === 'warning' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                    'bg-[#10B981]/20 text-[#10B981]'
                  }`}>
                    {item.icon}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. URL BREAKDOWN (Anatomy) */}
          <UrlAnatomy 
            url={currentResult.url} 
            features={currentResult.features} 
            classification={currentResult.classification} 
          />

          {/* 6. TECHNICAL DETAILS (Collapsible Section for Developers/SecOps) */}
          <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl overflow-hidden shadow-xl">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-[#9CA3AF] hover:text-white hover:bg-[#161B22] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#3B82F6]" />
                <span>{showTechnicalDetails ? 'Hide technical analysis' : 'View technical analysis (Engine details & weights)'}</span>
              </div>
              {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTechnicalDetails && (
              <div className="p-6 border-t border-[#1F2937] space-y-6 bg-[#0B0D0F]">
                {/* Static Feature Matrix Tokens */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Extracted Feature Vector (16 Features)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                    <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded-lg">
                      <span className="text-[10px] text-[#6B7280] block">URL Length</span>
                      <strong className="text-white">{currentResult.features.url_length}</strong> chars
                    </div>
                    <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded-lg">
                      <span className="text-[10px] text-[#6B7280] block">Domain Length</span>
                      <strong className="text-white">{currentResult.features.domain_length}</strong> chars
                    </div>
                    <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded-lg">
                      <span className="text-[10px] text-[#6B7280] block">Shannon Entropy</span>
                      <strong className="text-[#3B82F6]">{currentResult.features.domain_entropy}</strong> bits
                    </div>
                    <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded-lg">
                      <span className="text-[10px] text-[#6B7280] block">Subdomain Count</span>
                      <strong className="text-white">{currentResult.features.num_subdomains}</strong>
                    </div>
                    <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded-lg">
                      <span className="text-[10px] text-[#6B7280] block">Dots Count</span>
                      <strong className="text-white">{currentResult.features.num_dots}</strong>
                    </div>
                    <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded-lg">
                      <span className="text-[10px] text-[#6B7280] block">Hyphen Count</span>
                      <strong className="text-white">{currentResult.features.num_hyphens}</strong>
                    </div>
                    <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded-lg">
                      <span className="text-[10px] text-[#6B7280] block">IP Detection</span>
                      <strong className={currentResult.features.is_ip_address ? 'text-[#F43F5E]' : 'text-[#10B981]'}>
                        {currentResult.features.is_ip_address ? '1 (TRUE)' : '0 (FALSE)'}
                      </strong>
                    </div>
                    <div className="p-2.5 bg-[#161B22] border border-[#30363D] rounded-lg">
                      <span className="text-[10px] text-[#6B7280] block">HTTPS Protocol</span>
                      <strong className={currentResult.features.is_https ? 'text-[#10B981]' : 'text-[#F43F5E]'}>
                        {currentResult.features.is_https ? '1 (HTTPS)' : '0 (HTTP)'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Model Decision Contributions */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Random Forest Decision Contributions
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {Object.entries(currentResult.explanations).map(([flag, exp], i) => (
                      <div key={i} className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 shrink-0"></span>
                        <div>
                          <strong className="text-white">{flag}</strong>
                          <p className="text-[11px] text-[#9CA3AF] mt-0.5">{exp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. HOW IT WORKS (Directly below scanner / initial state) */}
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-white tracking-tight">
            How PhishGuard works
          </h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">
            Three simple steps to verify links before clicking:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-[#0B0D0F] border border-[#1F2937] flex flex-col justify-between space-y-3 relative group hover:border-[#3B82F6]/50 transition-colors">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] font-bold text-sm flex items-center justify-center font-mono">
                1
              </div>
              <h4 className="text-sm font-bold text-white">
                Paste
              </h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Paste the link you received in an email, SMS, or direct message.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-[#0B0D0F] border border-[#1F2937] flex flex-col justify-between space-y-3 relative group hover:border-[#3B82F6]/50 transition-colors">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] font-bold text-sm flex items-center justify-center font-mono">
                2
              </div>
              <h4 className="text-sm font-bold text-white">
                Analyze
              </h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                PhishGuard checks its structure, domain randomness, and security patterns locally.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-[#0B0D0F] border border-[#1F2937] flex flex-col justify-between space-y-3 relative group hover:border-[#3B82F6]/50 transition-colors">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] font-bold text-sm flex items-center justify-center font-mono">
                3
              </div>
              <h4 className="text-sm font-bold text-white">
                Understand
              </h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Get a clear risk result with plain-language explanations of any red flags.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. WANT TO TRY IT FIRST? (Safe Synthetic Demos) */}
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3B82F6]" />
              Want to try it first?
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Click any safe synthetic demo example to test how PhishGuard evaluates URLs:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Safe Demo Button */}
          <button
            onClick={() => handleDemoSelect('https://github.com/torvalds/linux')}
            className="p-3.5 rounded-xl bg-[#0B0D0F] hover:bg-[#161B22] border border-[#1F2937] hover:border-[#10B981]/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-[#10B981] transition-colors">
                Try Safe URL
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded font-bold uppercase bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Safe
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] truncate font-mono">
              https://github.com/torvalds/linux
            </p>
          </button>

          {/* Suspicious Demo Button */}
          <button
            onClick={() => handleDemoSelect('http://bit.ly/secure-login-39281')}
            className="p-3.5 rounded-xl bg-[#0B0D0F] hover:bg-[#161B22] border border-[#1F2937] hover:border-[#F59E0B]/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-[#F59E0B] transition-colors">
                Try Suspicious URL
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded font-bold uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                Suspicious
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] truncate font-mono">
              http://bit.ly/secure-login-39281
            </p>
          </button>

          {/* Phishing Demo Button */}
          <button
            onClick={() => handleDemoSelect('http://paypal-security-verification.xyz/login/verify.php?token=92841')}
            className="p-3.5 rounded-xl bg-[#0B0D0F] hover:bg-[#161B22] border border-[#1F2937] hover:border-[#F43F5E]/50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-[#F43F5E] transition-colors">
                Try Phishing URL
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded font-bold uppercase bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30">
                Phishing
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] truncate font-mono">
              http://paypal-security-verification.xyz/...
            </p>
          </button>
        </div>
      </div>

      {/* 9. DASHBOARD STATISTICS (Below scanner) */}
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Session Scan Statistics
            </h3>
            <p className="text-[11px] text-[#9CA3AF]">
              Aggregated across checks on this device
            </p>
          </div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('history')}
              className="text-xs text-[#3B82F6] hover:underline font-medium"
            >
              View History &rarr;
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937]">
            <span className="text-[10px] text-[#6B7280] font-sans font-bold uppercase">URLs Checked</span>
            <div className="text-2xl font-bold text-white mt-1">{Math.max(historyCount, currentResult ? 1 : 0)}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937]">
            <span className="text-[10px] text-[#10B981] font-sans font-bold uppercase">Likely Safe</span>
            <div className="text-2xl font-bold text-[#10B981] mt-1">
              {currentResult?.classification === 'SAFE' ? 1 : 0}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937]">
            <span className="text-[10px] text-[#F59E0B] font-sans font-bold uppercase">Suspicious</span>
            <div className="text-2xl font-bold text-[#F59E0B] mt-1">
              {currentResult?.classification === 'SUSPICIOUS' ? 1 : 0}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#1F2937]">
            <span className="text-[10px] text-[#F43F5E] font-sans font-bold uppercase">Likely Phishing</span>
            <div className="text-2xl font-bold text-[#F43F5E] mt-1">
              {currentResult?.classification === 'PHISHING' ? 1 : 0}
            </div>
          </div>
        </div>
      </div>

      {/* 10. PRIVACY / TRUST SECTION */}
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              Your links stay private
            </h3>
            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
              PhishGuard analyzes the URL structure locally and does not open the website. No external threat-intelligence API is required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


