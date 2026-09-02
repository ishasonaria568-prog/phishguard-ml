import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Layers, 
  History, 
  BookOpen, 
  Info, 
  Lock,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';

export type TabType = 'scanner' | 'history' | 'batch' | 'learn' | 'about';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, historyCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'scanner', label: 'Check URL', icon: Search },
    { id: 'history', label: 'History', count: historyCount, icon: History },
    { id: 'batch', label: 'Batch Check', icon: Layers },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info }
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-[#1F2937] bg-[#0F1216]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Identity */}
          <div 
            onClick={() => handleTabClick('scanner')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.35)] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-white font-sans">
                  Phish<span className="text-[#3B82F6]">Guard</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-[#161B22] text-[10px] rounded text-[#9CA3AF] font-medium border border-[#30363D]">
                  Free &amp; Offline
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] hidden md:block">
                Check whether a link looks safe or suspicious
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleTabClick(item.id as TabType)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#1F2937] text-[#9CA3AF]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Privacy Trust Indicator Badge & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-[#D1D5DB] text-[11px] font-medium">Private • Runs locally</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#161B22] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#1F2937] space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1F2937] text-[#9CA3AF] font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2 px-4 flex items-center gap-2 text-[11px] text-[#9CA3AF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              <span>Private • Runs locally (Zero URL telemetry)</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};


