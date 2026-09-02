import React from 'react';
import { UrlFeatures, RiskClassification } from '../types';
import { Lock, Globe, Tag, FileText, HelpCircle, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface UrlAnatomyProps {
  url: string;
  features: UrlFeatures;
  classification: RiskClassification;
}

export const UrlAnatomy: React.FC<UrlAnatomyProps> = ({ url, features, classification }) => {
  let parsedUrl: URL | null = null;
  try {
    const formatted = url.startsWith('http') ? url : 'http://' + url;
    parsedUrl = new URL(formatted);
  } catch {
    //
  }

  const scheme = features.scheme || (parsedUrl ? parsedUrl.protocol.replace(':', '') : 'http');
  const hostname = features.hostname || (parsedUrl ? parsedUrl.hostname : '');
  const path = features.path || (parsedUrl ? parsedUrl.pathname : '/');
  const query = features.query || (parsedUrl && parsedUrl.search ? parsedUrl.search : '');
  const tld = features.tld || '';

  const hostParts = hostname.split('.');
  const subdomains = hostParts.length > 2 ? hostParts.slice(0, hostParts.length - 2).join('.') : '';
  const domainCore = hostParts.length > 1 ? hostParts[hostParts.length - 2] : hostname;

  return (
    <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl p-6 shadow-xl space-y-6">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2937] pb-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-[#3B82F6]">
            URL breakdown
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
            Understand this URL
          </h3>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            These parts help the model identify unusual URL patterns without opening the website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-[#161B22] text-[#9CA3AF] border border-[#30363D] font-mono">
            {url.length} characters
          </span>
        </div>
      </div>

      {/* Visual Block Chain Breakdown */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider block">
          How this link is assembled:
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* 1. Protocol */}
          <div className={`p-3.5 rounded-lg border flex flex-col justify-between ${
            features.is_https 
              ? 'bg-[#10B981]/10 border-[#10B981]/30' 
              : 'bg-[#F43F5E]/10 border-[#F43F5E]/30'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">1. Protocol</span>
                {features.is_https ? (
                  <span className="text-[10px] font-bold text-[#10B981]">Encrypted</span>
                ) : (
                  <span className="text-[10px] font-bold text-[#F43F5E]">Plain HTTP</span>
                )}
              </div>
              <div className="font-mono text-sm font-bold text-white break-all">
                {scheme}://
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-2 leading-snug">
              {features.is_https ? 'HTTPS protects data in transit' : 'Insecure unencrypted connection'}
            </p>
          </div>

          {/* 2. Subdomain */}
          <div className={`p-3.5 rounded-lg border flex flex-col justify-between ${
            features.num_subdomains >= 2 
              ? 'bg-[#F43F5E]/10 border-[#F43F5E]/30' 
              : subdomains 
              ? 'bg-[#161B22] border-[#30363D]' 
              : 'bg-[#0B0D0F] border-[#1F2937]'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">2. Subdomain</span>
                {features.num_subdomains >= 2 && (
                  <span className="text-[10px] font-bold text-[#F43F5E]">Multiple levels</span>
                )}
              </div>
              <div className="font-mono text-sm font-bold text-white break-all">
                {subdomains ? `${subdomains}.` : '(none)'}
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-2 leading-snug">
              {features.num_subdomains >= 2 
                ? 'Multiple subdomains can mimic famous brand names'
                : subdomains 
                ? 'Standard single subdomain level'
                : 'No subdomain prefix used'}
            </p>
          </div>

          {/* 3. Main Domain */}
          <div className={`p-3.5 rounded-lg border flex flex-col justify-between ${
            features.is_ip_address 
              ? 'bg-[#F43F5E]/15 border-[#F43F5E]/40' 
              : features.has_prefix_suffix_hyphen 
              ? 'bg-[#F59E0B]/15 border-[#F59E0B]/40' 
              : 'bg-[#3B82F6]/10 border-[#3B82F6]/30'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">3. Domain</span>
                {features.is_ip_address ? (
                  <span className="text-[10px] font-bold text-[#F43F5E]">Raw IP</span>
                ) : (
                  <span className="text-[10px] font-bold text-[#3B82F6]">Host</span>
                )}
              </div>
              <div className="font-mono text-sm font-bold text-white break-all">
                {features.is_ip_address ? hostname : domainCore}
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-2 leading-snug">
              {features.is_ip_address
                ? 'Uses raw IP digits instead of a registered domain name'
                : features.has_prefix_suffix_hyphen
                ? 'Contains hyphens often used to spoof brand names'
                : 'Main registered domain authority'}
            </p>
          </div>

          {/* 4. Extension / TLD */}
          <div className={`p-3.5 rounded-lg border flex flex-col justify-between ${
            features.is_suspicious_tld 
              ? 'bg-[#F43F5E]/10 border-[#F43F5E]/30' 
              : 'bg-[#161B22] border-[#30363D]'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">4. Extension</span>
                {features.is_suspicious_tld ? (
                  <span className="text-[10px] font-bold text-[#F43F5E]">High-risk</span>
                ) : (
                  <span className="text-[10px] font-bold text-[#10B981]">Standard</span>
                )}
              </div>
              <div className="font-mono text-sm font-bold text-white break-all">
                {tld ? `.${tld}` : '(none)'}
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-2 leading-snug">
              {features.is_suspicious_tld
                ? `.${tld} is frequently associated with disposable spam domains`
                : 'Recognized top-level domain extension'}
            </p>
          </div>

          {/* 5. Path & Parameters */}
          <div className="p-3.5 rounded-lg bg-[#161B22] border border-[#30363D] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">5. Path &amp; Query</span>
                {query && <span className="text-[10px] font-bold text-[#F59E0B]">Parameters</span>}
              </div>
              <div className="font-mono text-sm font-bold text-white break-all">
                {path !== '/' ? path : ''}{query || (path === '/' ? '/' : '')}
              </div>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-2 leading-snug">
              {query 
                ? 'Carries additional web parameters or tracking tokens'
                : path !== '/' 
                ? 'Web page destination inside the domain'
                : 'Root homepage landing'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


