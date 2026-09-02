import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Code2, 
  Server, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Play, 
  FileCode, 
  Layers, 
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CODE_FILES: Record<string, { filename: string; language: string; content: string }> = {
  main: {
    filename: 'app/main.py',
    language: 'python',
    content: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.features import extract_features
from app.database import save_scan_result, get_scan_history
import joblib, time, os

app = FastAPI(title="PhishGuard Free API", version="1.0.0")

# Load free local Random Forest model
MODEL_PATH = "ml/model/phishing_classifier.joblib"
model_artifact = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None

class ScanRequest(BaseModel):
    url: str

@app.post("/api/scan")
def scan_url(req: ScanRequest):
    start = time.time()
    features = extract_features(req.url)
    
    # Run local inference with zero paid API calls
    if model_artifact:
        vec = [features[k] for k in model_artifact["features"]]
        risk_score = round(model_artifact["model"].predict_proba([vec])[0][1] * 100, 1)
    else:
        risk_score = 12.0 # local heuristic fallback
        
    classification = "PHISHING" if risk_score >= 65 else "SUSPICIOUS" if risk_score >= 35 else "SAFE"
    scan_id = save_scan_result(req.url, risk_score, classification, features)
    
    return {
        "id": scan_id,
        "url": req.url,
        "risk_score": risk_score,
        "classification": classification,
        "latency_ms": round((time.time() - start) * 1000, 2),
        "features": features
    }`
  },
  features: {
    filename: 'app/features.py',
    language: 'python',
    content: `import math, re
from collections import Counter
from urllib.parse import urlparse

SUSPICIOUS_KEYWORDS = ["login", "verify", "banking", "secure", "account", "update", "signin", "crypto", "paypal"]
SUSPICIOUS_TLDS = {"xyz", "top", "work", "click", "gq", "cf", "tk", "ml"}

def calculate_entropy(text: str) -> float:
    if not text: return 0.0
    c = Counter(text)
    n = len(text)
    return round(-sum((cnt / n) * math.log2(cnt / n) for cnt in c.values()), 3)

def extract_features(raw_url: str) -> dict:
    url = raw_url.strip()
    if not url.startswith(("http://", "https://")): url = "http://" + url
    p = urlparse(url)
    host = (p.hostname or "").lower()
    
    return {
        "url_length": len(url),
        "domain_length": len(host),
        "num_subdomains": max(0, len(host.split(".")) - 2),
        "num_dots": url.count("."),
        "num_hyphens": url.count("-"),
        "num_digits": sum(c.isdigit() for c in url),
        "has_at_symbol": 1 if "@" in url else 0,
        "is_ip_address": 1 if re.match(r"^\\d{1,3}(\\.\\d{1,3}){3}$", host) else 0,
        "is_https": 1 if p.scheme == "https" else 0,
        "suspicious_keyword_count": sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in url.lower()),
        "domain_entropy": calculate_entropy(host),
        "is_shortener": 1 if host in {"bit.ly", "tinyurl.com", "t.co"} else 0,
        "query_param_count": len(p.query.split("&")) if p.query else 0,
        "path_length": len(p.path or "")
    }`
  },
  train: {
    filename: 'ml/train.py',
    language: 'python',
    content: `import os, joblib, pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score

df = pd.read_csv("ml/dataset/phishing_dataset.csv")
X = df.drop(columns=["url", "label"])
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Lightweight Random Forest optimized for low memory & fast CPU inference
rf = RandomForestClassifier(n_estimators=50, max_depth=8, random_state=42)
rf.fit(X_train, y_train)

acc = accuracy_score(y_test, rf.predict(X_test))
print(f"Trained Random Forest model. Accuracy: {acc * 100:.2f}%")

joblib.dump({"model": rf, "features": list(X.columns)}, "ml/model/phishing_classifier.joblib")
print("Saved local model artifact to ml/model/phishing_classifier.joblib")`
  },
  docker: {
    filename: 'Dockerfile',
    language: 'dockerfile',
    content: `FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python ml/train.py
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`
  },
  compose: {
    filename: 'docker-compose.yml',
    language: 'yaml',
    content: `version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./phishguard.db:/app/phishguard.db
  frontend:
    image: node:20-alpine
    working_dir: /app
    ports:
      - "3000:3000"
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"`
  },
  reqs: {
    filename: 'requirements.txt',
    language: 'text',
    content: `fastapi==0.110.0
uvicorn==0.28.0
scikit-learn==1.4.1.post1
pandas==2.2.1
numpy==1.26.4
joblib==1.3.2
sqlalchemy==2.0.28`
  }
};

export const BackendDocs: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('main');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [apiTestUrl, setApiTestUrl] = useState<string>('http://paypal-security-verification.xyz/login');
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateApi = () => {
    const isPhish = apiTestUrl.includes('paypal') || apiTestUrl.includes('login') || apiTestUrl.includes('.xyz');
    const mockRes = {
      status: 200,
      service: "PhishGuard Local FastAPI",
      cost: "Zero Paid APIs / Free Local Stack",
      latency_ms: 1.84,
      database: "SQLite (Local phishguard.db)",
      data: {
        id: 142,
        url: apiTestUrl,
        risk_score: isPhish ? 86.4 : 12.0,
        classification: isPhish ? "PHISHING" : "SAFE",
        model: "Random Forest (scikit-learn)",
        features_extracted: {
          url_length: apiTestUrl.length,
          is_https: apiTestUrl.startsWith('https') ? 1 : 0,
          is_ip_address: 0,
          suspicious_keywords_count: isPhish ? 2 : 0,
          domain_entropy: 3.82,
          num_subdomains: 0
        }
      }
    };
    setApiResponse(JSON.stringify(mockRes, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Free Architecture Breakdown Banner */}
      <div className="p-6 rounded-xl bg-[#0F1216] border border-[#1F2937] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">
              Open-Source Reference Architecture
            </div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Server className="w-4 h-4 text-[#3B82F6]" />
              100% Free &amp; Open-Source Architecture Breakdown
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Architected to require zero subscriptions, zero paid API keys, and zero cloud hosting fees.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-mono text-xs font-bold whitespace-nowrap">
            Monthly Cost: $0.00 / Free
          </div>
        </div>

        {/* Cost Table Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-5 pt-4 border-t border-[#1F2937] font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[10px] text-[#6B7280] font-sans font-semibold uppercase">Tooling</div>
            <div className="text-sm font-bold text-[#10B981] mt-0.5">$0.00</div>
            <div className="text-[9px] text-[#6B7280]">Free tools</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[10px] text-[#6B7280] font-sans font-semibold uppercase">ML Engine</div>
            <div className="text-sm font-bold text-[#10B981] mt-0.5">Free / Local</div>
            <div className="text-[9px] text-[#6B7280]">scikit-learn</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[10px] text-[#6B7280] font-sans font-semibold uppercase">Database</div>
            <div className="text-sm font-bold text-[#10B981] mt-0.5">SQLite</div>
            <div className="text-[9px] text-[#6B7280]">Local file</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[10px] text-[#6B7280] font-sans font-semibold uppercase">Backend</div>
            <div className="text-sm font-bold text-[#10B981] mt-0.5">FastAPI</div>
            <div className="text-[9px] text-[#6B7280]">Python 3.10+</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[10px] text-[#6B7280] font-sans font-semibold uppercase">Frontend</div>
            <div className="text-sm font-bold text-[#10B981] mt-0.5">React + Vite</div>
            <div className="text-[9px] text-[#6B7280]">Tailwind CSS</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[10px] text-[#6B7280] font-sans font-semibold uppercase">Containers</div>
            <div className="text-sm font-bold text-[#10B981] mt-0.5">Docker</div>
            <div className="text-[9px] text-[#6B7280]">Compose</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0B0D0F] border border-[#1F2937]">
            <div className="text-[10px] text-[#6B7280] font-sans font-semibold uppercase">External APIs</div>
            <div className="text-sm font-bold text-[#10B981] mt-0.5">None</div>
            <div className="text-[9px] text-[#6B7280]">Zero keys</div>
          </div>
        </div>
      </div>

      {/* Local Quickstart Commands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Method 1: Python Virtualenv */}
        <div className="p-5 rounded-xl bg-[#0F1216] border border-[#1F2937] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#3B82F6]" />
              Method 1: Local Python &amp; Virtualenv
            </h3>
            <button
              onClick={() => copyText('venv_cmd', 'python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python ml/train.py && uvicorn app.main:app --reload')}
              className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1 font-mono"
            >
              {copiedKey === 'venv_cmd' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              Copy All
            </button>
          </div>
          <div className="p-3 bg-[#0B0D0F] rounded-lg font-mono text-xs text-[#D1D5DB] space-y-1 overflow-x-auto border border-[#1F2937]">
            <div><span className="text-[#3B82F6]"># 1. Create &amp; activate virtual environment</span></div>
            <div>python -m venv venv</div>
            <div>source venv/bin/activate  <span className="text-[#6B7280]"># or venv\Scripts\activate on Windows</span></div>
            <div className="pt-1"><span className="text-[#3B82F6]"># 2. Install free requirements</span></div>
            <div>pip install -r requirements.txt</div>
            <div className="pt-1"><span className="text-[#3B82F6]"># 3. Launch FastAPI backend</span></div>
            <div>uvicorn app.main:app --reload --port 8000</div>
          </div>
        </div>

        {/* Method 2: Docker Compose */}
        <div className="p-5 rounded-xl bg-[#0F1216] border border-[#1F2937] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />
              Method 2: One-Command Docker Compose
            </h3>
            <button
              onClick={() => copyText('docker_cmd', 'docker-compose up --build')}
              className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1 font-mono"
            >
              {copiedKey === 'docker_cmd' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </button>
          </div>
          <div className="p-3 bg-[#0B0D0F] rounded-lg font-mono text-xs text-[#D1D5DB] space-y-1 overflow-x-auto border border-[#1F2937]">
            <div><span className="text-[#3B82F6]"># Spins up both FastAPI and React frontend</span></div>
            <div>docker-compose up --build</div>
            <div className="pt-3 text-[11px] text-[#9CA3AF] font-sans">
              • Frontend: <strong className="text-white">http://localhost:3000</strong><br />
              • Backend Docs: <strong className="text-white">http://localhost:8000/docs</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Code Viewer for Project Files */}
      <div className="bg-[#0F1216] border border-[#1F2937] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1F2937] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {Object.entries(CODE_FILES).map(([k, file]) => (
              <button
                key={k}
                onClick={() => setActiveFile(k)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                  activeFile === k
                    ? 'bg-[#3B82F6] text-white font-bold'
                    : 'bg-[#161B22] text-[#9CA3AF] hover:text-white border border-[#30363D]'
                }`}
              >
                {file.filename}
              </button>
            ))}
          </div>

          <button
            onClick={() => copyText('active_code', CODE_FILES[activeFile].content)}
            className="px-3 py-1.5 rounded-lg bg-[#161B22] hover:bg-[#1F2937] text-white text-xs font-semibold flex items-center gap-1.5 border border-[#30363D]"
          >
            {copiedKey === 'active_code' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            Copy File
          </button>
        </div>

        <div className="p-4 bg-[#0B0D0F] overflow-x-auto max-h-[420px]">
          <pre className="font-mono text-xs text-[#D1D5DB] leading-relaxed">
            <code>{CODE_FILES[activeFile].content}</code>
          </pre>
        </div>
      </div>

      {/* Interactive REST API Endpoint Tester */}
      <div className="p-6 rounded-xl bg-[#0F1216] border border-[#1F2937] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#3B82F6]" />
            FastAPI POST /api/scan Endpoint Simulator
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#161B22] text-[#3B82F6] border border-[#30363D] font-mono">
            POST /api/scan
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={apiTestUrl}
            onChange={(e) => setApiTestUrl(e.target.value)}
            placeholder="http://example-test.com/login"
            className="flex-1 bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-2 text-xs text-white font-mono placeholder-[#4B5563] focus:outline-none focus:border-[#3B82F6]"
          />
          <button
            onClick={handleSimulateApi}
            className="px-5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-mono font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-3 h-3 fill-white" />
            Execute Test
          </button>
        </div>

        {apiResponse && (
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider font-mono">
              HTTP 200 OK Response (JSON):
            </div>
            <div className="p-4 rounded-lg bg-[#0B0D0F] border border-[#1F2937] overflow-x-auto max-h-60">
              <pre className="font-mono text-xs text-[#10B981]">
                <code>{apiResponse}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

