import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sliders, 
  ArrowRight,
  Eye,
  KeyRound,
  Mail,
  Smartphone,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { FeatureSandbox } from './FeatureSandbox';

interface QuizQuestion {
  id: number;
  url: string;
  isPhish: boolean;
  brand: string;
  explanation: string;
  tricks: string[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    url: 'https://www.amazon.com/dp/B08N5WRWNW',
    isPhish: false,
    brand: 'Amazon',
    explanation: 'Legitimate Amazon product page. The root domain is "amazon.com" over encrypted HTTPS with a standard product directory structure.',
    tricks: ['Official root domain: amazon.com', 'Standard HTTPS encryption', 'Clean standard path']
  },
  {
    id: 2,
    url: 'http://netflix-billing-update.xyz/login/verify',
    isPhish: true,
    brand: 'Netflix',
    explanation: 'Phishing attack. The real domain is not netflix.com, but an unauthorized "netflix-billing-update" on a cheap disposable .xyz extension using unencrypted HTTP.',
    tricks: ['Fake root domain with brand hyphenation', 'High-abuse TLD (.xyz)', 'Unencrypted HTTP transport', 'Urgency keyword: "billing-update"']
  },
  {
    id: 3,
    url: 'https://appleid.apple.com/sign-in',
    isPhish: false,
    brand: 'Apple',
    explanation: 'Legitimate Apple ID sign-in page. The authentic root domain is "apple.com" with a valid official subdomain "appleid".',
    tricks: ['Authentic Apple root domain', 'Legitimate first-party subdomain (appleid.apple.com)', 'Secure HTTPS protocol']
  },
  {
    id: 4,
    url: 'https://paypal.com.account-verification-service.com/signin',
    isPhish: true,
    brand: 'PayPal',
    explanation: 'Deceptive subdomain trickery. The actual registered domain is "account-verification-service.com". The attacker placed "paypal.com" as a subdomain prefix to trick your eyes.',
    tricks: ['Subdomain stacking to disguise real domain', 'Real host is account-verification-service.com', 'Mimics PayPal brand name in prefix']
  },
  {
    id: 5,
    url: 'http://192.168.104.55/chase/online-banking/auth',
    isPhish: true,
    brand: 'Chase Bank',
    explanation: 'Direct IP address hostname. Legitimate financial institutions never use raw numbers (IPs) for customer logins.',
    tricks: ['Raw numerical IP instead of domain name', 'Spoofs Chase banking brand in path', 'Lacks HTTPS encryption']
  }
];

export const LearnSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'sandbox' | 'quiz'>('guide');
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean | null>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleAnswer = (questionId: number, answer: boolean) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    setShowResults(prev => ({ ...prev, [questionId]: true }));
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setShowResults({});
  };

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = QUIZ_QUESTIONS.filter(q => userAnswers[q.id] === q.isPhish).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2937] pb-6">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#3B82F6] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cybersecurity Academy</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              How Phishing Links Work &amp; How to Spot Them
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-1.5 max-w-2xl leading-relaxed">
              Understand the red flags attackers use to manipulate URLs, test your intuition with interactive real-world examples, and master the fundamental anatomy of safe web addresses.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1.5 bg-[#0B0D0F] p-1.5 rounded-xl border border-[#1F2937] self-start md:self-auto">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'guide'
                  ? 'bg-[#3B82F6] text-white shadow-md'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              Essential Guide
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-[#3B82F6] text-white shadow-md'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Spot the Phish Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'sandbox'
                  ? 'bg-[#3B82F6] text-white shadow-md'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>ML Feature Simulator</span>
            </button>
          </div>
        </div>

        {/* View 1: Educational Guide */}
        {activeTab === 'guide' && (
          <div className="pt-6 space-y-8">
            {/* Top 4 Phishing Anatomy Tricks */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#3B82F6]" />
                The 4 Most Common Deceptive URL Tricks
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Subdomain Trick */}
                <div className="bg-[#0B0D0F] border border-[#1F2937] rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> Trick 1: Subdomain Camouflage
                  </div>
                  <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D] font-mono text-xs overflow-x-auto text-white">
                    <span className="text-amber-400">https://</span>
                    <span className="text-rose-400 font-bold">paypal.com.</span>
                    <span className="text-[#3B82F6] font-bold">secure-auth.xyz</span>
                    <span className="text-[#9CA3AF]">/login</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Browsers read domains from right to left. The real destination is <strong className="text-white">secure-auth.xyz</strong>. Attackers prepend <span className="text-rose-400 font-mono">paypal.com</span> as a subdomain prefix to deceive people scanning quickly.
                  </p>
                </div>

                {/* Card 2: Typosquatting */}
                <div className="bg-[#0B0D0F] border border-[#1F2937] rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> Trick 2: Lookalike Typosquatting
                  </div>
                  <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D] font-mono text-xs overflow-x-auto text-white">
                    <span className="text-rose-400 font-bold line-through mr-2">netflix.com</span>
                    &rarr;
                    <span className="text-rose-400 font-bold ml-2">netfl<span className="underline decoration-rose-500 font-extrabold text-white">1</span>x.com</span>
                    <span className="text-xs text-[#9CA3AF] ml-2">or paypa<span className="underline decoration-rose-500 font-extrabold text-white">I</span>.com</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Swapping the letter <strong className="text-white">"i"</strong> for the number <strong className="text-white">"1"</strong> or a lowercase <strong className="text-white">"l"</strong> creates visually indistinguishable clones that route victims to phishing credential harvesters.
                  </p>
                </div>

                {/* Card 3: Direct IP Addresses */}
                <div className="bg-[#0B0D0F] border border-[#1F2937] rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> Trick 3: Raw IP Addresses
                  </div>
                  <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D] font-mono text-xs overflow-x-auto text-white">
                    <span className="text-amber-400">http://</span>
                    <span className="text-rose-400 font-bold">185.220.101.5</span>
                    <span className="text-[#9CA3AF]">/bank/verify-id</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Legitimate companies always purchase clean branded domain names. If a link directs you to four sets of numbers (an IP address), it is nearly guaranteed to be malicious or rogue infrastructure.
                  </p>
                </div>

                {/* Card 4: The @ Symbol Redirection */}
                <div className="bg-[#0B0D0F] border border-[#1F2937] rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> Trick 4: The "@" Authority Bypass
                  </div>
                  <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D] font-mono text-xs overflow-x-auto text-white">
                    <span className="text-amber-400">https://</span>
                    <span className="text-rose-400 font-bold">google.com</span>
                    <span className="text-rose-400 font-extrabold">@</span>
                    <span className="text-[#3B82F6] font-bold">evil-server.net</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    In internet URL standards, everything before the <span className="text-rose-400 font-mono">@</span> symbol is treated as username credentials and ignored by the browser, quietly sending you to <strong className="text-white">evil-server.net</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* 5 Golden Rules Checklist */}
            <div className="bg-[#0B0D0F] border border-[#1F2937] rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                5 Golden Rules When You Receive an Unsolicited Link
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-[#161B22] rounded-xl border border-[#1F2937] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center text-[11px] shrink-0 font-mono">1</span>
                    Inspect the Real Root Domain
                  </div>
                  <p className="text-xs text-[#9CA3AF]">
                    Look at the word immediately before the domain extension (like <span className="text-white font-mono">.com</span>). Ignore what comes before it.
                  </p>
                </div>

                <div className="p-3.5 bg-[#161B22] rounded-xl border border-[#1F2937] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center text-[11px] shrink-0 font-mono">2</span>
                    HTTPS Does Not Mean "Safe"
                  </div>
                  <p className="text-xs text-[#9CA3AF]">
                    HTTPS only encrypts connection traffic. Anyone—including phishing criminals—can obtain a free HTTPS certificate today.
                  </p>
                </div>

                <div className="p-3.5 bg-[#161B22] rounded-xl border border-[#1F2937] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center text-[11px] shrink-0 font-mono">3</span>
                    Beware Artificial Urgency
                  </div>
                  <p className="text-xs text-[#9CA3AF]">
                    Phrases like "Account suspended in 24 hours", "Verify tax refund immediately", or "Unusual activity detected" are designed to trigger panic.
                  </p>
                </div>

                <div className="p-3.5 bg-[#161B22] rounded-xl border border-[#1F2937] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center text-[11px] shrink-0 font-mono">4</span>
                    Navigate Directly to the App
                  </div>
                  <p className="text-xs text-[#9CA3AF]">
                    If your bank or email warns you about an issue, open a new tab and type their official address directly rather than clicking the email link.
                  </p>
                </div>

                <div className="p-3.5 bg-[#161B22] rounded-xl border border-[#1F2937] space-y-1.5 sm:col-span-2 lg:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center text-[11px] shrink-0 font-mono">5</span>
                    Enable Hardware or Authenticator MFA (2FA)
                  </div>
                  <p className="text-xs text-[#9CA3AF]">
                    App-based authenticators (like Google Authenticator) or security keys (FIDO2/Passkeys) protect you even if you accidentally submit your password to a fake website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Interactive Quiz */}
        {activeTab === 'quiz' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0B0D0F] border border-[#1F2937] rounded-xl">
              <div>
                <h2 className="text-sm font-bold text-white">Spot the Phish: 5 Challenge Questions</h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Can you tell whether each link is safe or an attacker's fake? Select your verdict to test your skills.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-mono text-[#D1D5DB]">
                  Score: <strong className="text-[#3B82F6]">{correctCount}</strong> / {answeredCount}
                </div>
                {answeredCount > 0 && (
                  <button
                    onClick={resetQuiz}
                    className="px-3 py-1.5 text-xs bg-[#161B22] hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white rounded-lg border border-[#30363D] transition-colors"
                  >
                    Reset Quiz
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const answered = showResults[q.id];
                const selected = userAnswers[q.id];
                const isCorrect = selected === q.isPhish;

                return (
                  <div 
                    key={q.id}
                    className={`p-5 rounded-xl border transition-all ${
                      answered 
                        ? isCorrect
                          ? 'bg-[#10B981]/5 border-[#10B981]/30'
                          : 'bg-[#F43F5E]/5 border-[#F43F5E]/30'
                        : 'bg-[#0B0D0F] border-[#1F2937]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1F2937]/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#6B7280]">#{idx + 1}</span>
                        <span className="text-xs font-semibold text-white">Target Brand: {q.brand}</span>
                      </div>
                      {answered && (
                        <div className={`text-xs font-bold flex items-center gap-1.5 ${
                          isCorrect ? 'text-[#10B981]' : 'text-[#F43F5E]'
                        }`}>
                          {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          <span>{isCorrect ? 'Correct analysis!' : 'Incorrect verdict'}</span>
                        </div>
                      )}
                    </div>

                    <div className="my-3.5 p-3 rounded-lg bg-[#161B22] border border-[#30363D] font-mono text-xs text-white break-all">
                      {q.url}
                    </div>

                    {!answered ? (
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-xs text-[#9CA3AF] mr-2">What is your verdict?</span>
                        <button
                          onClick={() => handleAnswer(q.id, false)}
                          className="px-4 py-2 text-xs font-bold rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Likely Safe</span>
                        </button>
                        <button
                          onClick={() => handleAnswer(q.id, true)}
                          className="px-4 py-2 text-xs font-bold rounded-lg bg-[#F43F5E]/15 hover:bg-[#F43F5E]/25 text-[#F43F5E] border border-[#F43F5E]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Phishing Trap</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 space-y-2">
                        <p className="text-xs text-[#D1D5DB] leading-relaxed">
                          <strong className="text-white">Explanation: </strong>
                          {q.explanation}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {q.tricks.map((trick, tIdx) => (
                            <span 
                              key={tIdx}
                              className={`text-[11px] px-2.5 py-1 rounded-md border font-medium ${
                                q.isPhish 
                                  ? 'bg-[#F43F5E]/10 border-[#F43F5E]/20 text-[#F43F5E]'
                                  : 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]'
                              }`}
                            >
                              &bull; {trick}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View 3: Embedded Feature Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="pt-6">
            <FeatureSandbox />
          </div>
        )}
      </div>
    </div>
  );
};
