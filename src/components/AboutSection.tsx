import React, { useState } from 'react';
import { 
  Info, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Code2, 
  Database, 
  Server, 
  Zap, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Layers,
  Terminal,
  Github,
  Linkedin,
  UserCheck
} from 'lucide-react';
import { BackendDocs } from './BackendDocs';
import { DatasetViewer } from './DatasetViewer';

export const AboutSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'api' | 'dataset' | 'faq'>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does PhishGuard send my visited URLs to a remote server?',
      a: 'No. PhishGuard is built with an offline-first architecture. All URL parsing, Shannon entropy calculations, keyword matching, and probability scores are computed locally in your web browser JavaScript runtime. Your search history never leaves your device.'
    },
    {
      q: 'Does a padlock or "HTTPS" mean a website is 100% safe?',
      a: 'No. HTTPS only ensures that the communication between your browser and the website server is encrypted. Today, over 80% of phishing sites also use free SSL/TLS certificates (e.g. Let\'s Encrypt). A padlock does not guarantee the identity or legitimacy of the site owner.'
    },
    {
      q: 'What is Shannon Entropy and why does PhishGuard measure it?',
      a: 'Shannon entropy measures the randomness of characters in the domain string. Human-created websites typically have low entropy (e.g., "google.com" ≈ 2.2 bits), whereas malware and phishing domains generated automatically by algorithms (Domain Generation Algorithms / DGAs) have high entropy (e.g., "x9k12z-pq81.xyz" ≈ 3.8+ bits).'
    },
    {
      q: 'Can I integrate PhishGuard\'s detection engine into my own Python or Node.js server?',
      a: 'Yes! Check out the "Python API & Docs" tab above. We provide complete, ready-to-deploy FastAPI, feature extraction, and SQLite storage scripts that you can run locally for free without external API keys.'
    },
    {
      q: 'How does PhishGuard handle URL shorteners like bit.ly or tinyurl?',
      a: 'URL shorteners obscure the real destination. PhishGuard flags shortened links with an elevated risk indicator and recommends expanding or verifying them before entering credentials or downloading files.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2937] pb-6">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#3B82F6] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Project Overview &amp; Architecture</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              About PhishGuard
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-1.5 max-w-2xl leading-relaxed">
              A private, lightweight phishing URL detection engine powered by machine learning and heuristic pattern recognition with zero third-party dependencies.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0D0F] p-1.5 rounded-xl border border-[#1F2937] self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'overview'
                  ? 'bg-[#3B82F6] text-white shadow-md'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSubTab('api')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'api'
                  ? 'bg-[#3B82F6] text-white shadow-md'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Python Backend &amp; API</span>
            </button>
            <button
              onClick={() => setActiveSubTab('dataset')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'dataset'
                  ? 'bg-[#3B82F6] text-white shadow-md'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Benchmark Dataset</span>
            </button>
            <button
              onClick={() => setActiveSubTab('faq')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'faq'
                  ? 'bg-[#3B82F6] text-white shadow-md'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              FAQ
            </button>
          </div>
        </div>

        {/* View 1: Main Project Overview */}
        {activeSubTab === 'overview' && (
          <div className="pt-6 space-y-8">
            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white">100% Private &amp; Offline</h2>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  No tracking scripts, no telemetry, and zero remote API calls. All URL inspections run instantly inside your browser memory.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                  <Cpu className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white">Heuristic + ML Pipeline</h2>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Extracts 12 multi-dimensional signals including Shannon information entropy, brand typosquatting, and sub-domain stacking.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white">Sub-Millisecond Speed</h2>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Evaluates link safety in under 2 milliseconds, making it suitable for live browser protection, email filters, and batch pipelines.
                </p>
              </div>
            </div>

            {/* How It Works Technical Section */}
            <div className="p-6 rounded-xl bg-[#0B0D0F] border border-[#1F2937] space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#3B82F6]" />
                How the Detection Engine Analyzes Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 bg-[#161B22] rounded-xl border border-[#1F2937] space-y-2">
                  <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider block">1. Structural Parsing</span>
                  <p className="text-xs text-[#9CA3AF]">
                    Deconstructs the target URL into protocol, root domain, top-level domain (TLD), subdomains, file path, and query parameters.
                  </p>
                </div>

                <div className="p-4 bg-[#161B22] rounded-xl border border-[#1F2937] space-y-2">
                  <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider block">2. Shannon Entropy Calculation</span>
                  <p className="text-xs text-[#9CA3AF]">
                    Measures the randomness of character distributions to detect algorithmically generated domains (DGA) and gibberish hosts.
                  </p>
                </div>

                <div className="p-4 bg-[#161B22] rounded-xl border border-[#1F2937] space-y-2">
                  <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider block">3. Lexical &amp; Brand Spoofing</span>
                  <p className="text-xs text-[#9CA3AF]">
                    Searches for brand impersonations (e.g. "paypal-login", "apple-verify") and suspicious keywords frequently seen in phishing campaigns.
                  </p>
                </div>

                <div className="p-4 bg-[#161B22] rounded-xl border border-[#1F2937] space-y-2">
                  <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider block">4. TLD &amp; Protocol Verification</span>
                  <p className="text-xs text-[#9CA3AF]">
                    Cross-references known high-abuse top-level domains (.xyz, .top, .click) and checks whether the transport is protected by TLS encryption.
                  </p>
                </div>
              </div>
            </div>

            {/* Creator & Developer Profile Card */}
            <div className="p-6 rounded-xl bg-[#0B0D0F] border border-[#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <UserCheck className="w-4 h-4 text-[#3B82F6]" />
                  <span>Developer &amp; Maintainer</span>
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  Designed and created by <strong className="text-white">Isha Sonaria</strong>. Connect on GitHub or LinkedIn to collaborate or report issues.
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href="https://github.com/ishasonaria568-prog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161B22] hover:bg-[#1F2937] text-white border border-[#30363D] hover:border-[#3B82F6] transition-all text-xs font-semibold"
                >
                  <Github className="w-4 h-4 text-[#3B82F6]" />
                  <span>GitHub Profile</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/isha-sonaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161B22] hover:bg-[#1F2937] text-white border border-[#30363D] hover:border-[#0A66C2] transition-all text-xs font-semibold"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Privacy Guarantee Banner */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#161B22] to-[#0F1216] border border-[#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Privacy Pledge</span>
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  PhishGuard does not use third-party tracking, cookies, or remote analytics. Your scanned URLs remain on your computer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Python Backend Docs */}
        {activeSubTab === 'api' && (
          <div className="pt-6">
            <BackendDocs />
          </div>
        )}

        {/* View 3: Dataset Benchmark */}
        {activeSubTab === 'dataset' && (
          <div className="pt-6">
            <DatasetViewer />
          </div>
        )}

        {/* View 4: FAQ */}
        {activeSubTab === 'faq' && (
          <div className="pt-6 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#0B0D0F] border border-[#1F2937] rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-[#161B22]/50 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6B7280] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#9CA3AF] leading-relaxed border-t border-[#1F2937]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
