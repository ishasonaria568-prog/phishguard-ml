/**
 * PhishGuard - 100% Free & Offline ML Phishing URL Detection System
 * Geometric Balance Design Theme
 */

import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { SingleScanner } from './components/SingleScanner';
import { BatchScanner } from './components/BatchScanner';
import { UrlAnatomy } from './components/UrlAnatomy';
import { FeatureSandbox } from './components/FeatureSandbox';
import { DatasetViewer } from './components/DatasetViewer';
import { HistoryList } from './components/HistoryList';
import { BackendDocs } from './components/BackendDocs';
import { LearnSection } from './components/LearnSection';
import { AboutSection } from './components/AboutSection';
import { ScanResult } from './types';
import { getStoredScans, saveScanToStorage, clearStoredScans } from './lib/storage';
import { evaluateUrl } from './lib/mlModel';
import { ShieldCheck, Cpu, Database, Activity, Search, Sparkles, Github, Linkedin, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('scanner');
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [latestScan, setLatestScan] = useState<ScanResult | null>(null);

  // Initialize history from local storage only (no auto-scan on startup)
  useEffect(() => {
    const existing = getStoredScans();
    if (existing && existing.length > 0) {
      setHistory(existing);
    }
  }, []);

  const handleScanComplete = (result: ScanResult) => {
    setLatestScan(result);
    const updated = saveScanToStorage(result);
    setHistory(updated);
  };

  const handleBatchComplete = (results: ScanResult[]) => {
    if (results.length > 0) {
      setLatestScan(results[0]);
      let current = [...history];
      for (const res of results) {
        current = saveScanToStorage(res);
      }
      setHistory(current);
    }
  };

  const handleSelectHistoryScan = (scan: ScanResult) => {
    setLatestScan(scan);
    setActiveTab('scanner');
  };

  const handleClearHistory = () => {
    clearStoredScans();
    setHistory([]);
  };

  const handleTrySampleScan = (sampleUrl: string) => {
    const res = evaluateUrl(sampleUrl);
    handleScanComplete(res);
  };

  return (
    <div className="min-h-screen bg-[#0B0D0F] text-[#D1D5DB] flex flex-col font-sans selection:bg-[#3B82F6]/30 selection:text-white">
      {/* Header with Navigation and System Status */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        historyCount={history.length} 
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scanner' && (
          <SingleScanner 
            onScanComplete={handleScanComplete} 
            latestScan={latestScan} 
          />
        )}

        {activeTab === 'batch' && (
          <BatchScanner 
            onScanBatchComplete={handleBatchComplete}
            onSelectResult={(result) => {
              setLatestScan(result);
              setActiveTab('scanner');
            }}
          />
        )}

        {activeTab === 'anatomy' && (
          latestScan ? (
            <div className="space-y-6">
              <UrlAnatomy 
                url={latestScan.url} 
                features={latestScan.features} 
                classification={latestScan.classification} 
              />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-[#0F1216] border border-[#1F2937] rounded-2xl p-8 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-[#161B22] border border-[#1F2937] flex items-center justify-center mx-auto text-[#3B82F6]">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">No active URL analysis yet</h3>
                <p className="text-xs text-[#9CA3AF] mt-1 max-w-md mx-auto">
                  Scan a link first using the detector, or click a quick sample below to see its full structural breakdown.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => handleTrySampleScan('https://www.google.com/search?q=cybersecurity')}
                  className="px-3.5 py-1.5 rounded-lg text-xs bg-[#161B22] hover:bg-[#1F2937] text-[#10B981] border border-[#10B981]/30 font-medium"
                >
                  Analyze Legitimate URL
                </button>
                <button
                  onClick={() => handleTrySampleScan('http://paypal-security-verification.xyz/login/verify.php?token=92841')}
                  className="px-3.5 py-1.5 rounded-lg text-xs bg-[#161B22] hover:bg-[#1F2937] text-[#F43F5E] border border-[#F43F5E]/30 font-medium"
                >
                  Analyze Phishing URL
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'sandbox' && (
          <FeatureSandbox />
        )}

        {activeTab === 'dataset' && (
          <DatasetViewer />
        )}

        {activeTab === 'history' && (
          <HistoryList 
            history={history} 
            onSelectScan={handleSelectHistoryScan} 
            onClearHistory={handleClearHistory} 
          />
        )}

        {activeTab === 'learn' && (
          <LearnSection />
        )}

        {activeTab === 'about' && (
          <AboutSection />
        )}

        {activeTab === 'backend' && (
          <BackendDocs />
        )}
      </main>

      {/* Geometric Balanced System Footer */}
      <footer className="border-t border-[#1F2937] bg-[#0F1216] py-5 px-4 sm:px-8 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span className="text-[#D1D5DB]">100% Free &amp; Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9CA3AF]">Zero tracking &bull; In-browser ML</span>
            </div>
          </div>

          {/* Developer links */}
          <div className="flex items-center gap-3">
            <span className="text-[#9CA3AF] text-xs">Developed by <strong className="text-white font-semibold">Isha Sonaria</strong>:</span>
            <a
              href="https://github.com/ishasonaria568-prog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161B22] hover:bg-[#1F2937] text-[#D1D5DB] hover:text-white border border-[#30363D] transition-all hover:border-[#3B82F6] text-xs font-medium"
              title="Isha Sonaria's GitHub"
            >
              <Github className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/isha-sonaria/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161B22] hover:bg-[#1F2937] text-[#D1D5DB] hover:text-white border border-[#30363D] transition-all hover:border-[#0A66C2] text-xs font-medium"
              title="Isha Sonaria's LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


