# 🛡️ PhishGuard — Free & Offline Phishing URL Detector

A 100% **free and open-source** phishing URL detection platform powered by offline machine learning (Random Forest), static heuristic analysis, and a local SQLite database.

**Zero API keys. Zero paid cloud services. Zero external network telemetry during scanning.**

---

## 💰 Cost

```text
Development Cost: ₹0
ML Model: Free / Local
Database: SQLite
Backend: FastAPI
Frontend: React
Containerization: Docker
External APIs: Not required
```

> **Note on Free & Offline Operation**: Optional external threat-intelligence integrations (like VirusTotal, WHOIS, or SSL cert check APIs) can be added in the future as optional plugins, but are strictly **not required** for the core URL classification system. The application functions entirely offline using high-performance static feature extraction and a local Scikit-Learn Random Forest model.

---

## 🚀 Key Features

- **⚡ 100% Offline Static Feature Extraction**: Extracts 16 structural, syntactic, and entropy-based features in < 5ms without outbound network calls.
- **🌲 Local Random Forest Classifier**: High-precision scikit-learn model trained on balanced public datasets.
- **🔍 Granular Explainability**: Feature contribution breakdown showing exactly why a URL was marked Safe, Suspicious, or Phishing.
- **🔬 Interactive URL Anatomy Visualizer**: Deconstructs Scheme, Hostname, Subdomains, Domain, TLD, Path, and Query params with inline security annotations.
- **📦 Batch URL Scanning**: Process up to 100 URLs simultaneously with instant performance telemetry and CSV/JSON export.
- **🗃️ Zero-Config SQLite Storage**: Automatically records scan history, aggregates risk metrics, and supports instant purge.
- **🐳 Docker & Docker Compose Support**: Spin up both the FastAPI backend and React frontend with a single command.

---

## 🛠️ Free Technology Stack

| Layer | Technology | Cost | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend** | Python 3.10+ / FastAPI / Uvicorn | **₹0** | High-speed REST API & inference runner |
| **Machine Learning** | scikit-learn / NumPy / pandas / joblib | **₹0** | Local Random Forest training & classification |
| **Frontend** | React 19 / Vite / Tailwind CSS / Lucide | **₹0** | Responsive, dark/light security dashboard |
| **Database** | SQLite 3 | **₹0** | Embedded local relational storage |
| **Container** | Docker / Docker Compose | **₹0** | Local containerized microservices |

---

## 📊 Extracted Static URL Features (Offline)

1. **URL Length**: Detection of oversized URLs often used in payload obfuscation.
2. **Domain Length**: Measuring hostname character count.
3. **Number of Subdomains**: Identifying deep subdomain hijacking (e.g. `paypal.com.verify.xyz`).
4. **Number of Dots**: High dot frequency indicates complex redirection or spoofing.
5. **Number of Hyphens**: Detects deceptive brand typosquatting (e.g. `apple-id-verify`).
6. **Number of Digits**: Flags hex-encoded strings or randomized tracking tokens.
7. **Number of Special Characters**: Measures punctuation density.
8. **`@` Symbol**: Identifies browser credential-delimiter spoofing attacks.
9. **IP Address Detection**: Flags direct IPv4 addresses (e.g., `http://192.168.1.1/login`).
10. **HTTPS Detection**: Validates transport encryption vs unencrypted HTTP.
11. **Suspicious Keyword Count**: Scans for high-frequency targets (`login`, `banking`, `verify`, `wallet`, `secure`, `crypto`).
12. **Domain Shannon Entropy**: Calculates mathematical randomness to detect DGA (Domain Generation Algorithms).
13. **URL Shortener Detection**: Identifies shortener redirects (`bit.ly`, `tinyurl.com`, `t.co`, etc.).
14. **Query Parameter Count**: Counts GET parameters used for tracking victims.
15. **Path Length**: Measures deep malicious directory hierarchies.
16. **Suspicious TLD Check**: Flags high-abuse top-level domains (`.xyz`, `.top`, `.click`, `.gq`, `.tk`, `.work`).

---

## 🚀 Deployment & Architecture Modes

PhishGuard supports two operating modes:

```text
                 PHISHGUARD
                     │
          ┌──────────┴──────────┐
          │                     │
       VERCEL               LOCAL / Docker
          │                     │
    React + Vite          React + FastAPI
    Browser-side ML       Python ML (scikit-learn)
    localStorage          SQLite Database
          │                     │
          └──────────┬──────────┘
                     │
              Same PhishGuard
               core experience
```

---

# Deploy to Vercel

The Vercel deployment builds the **React + Vite frontend** with in-browser static feature extraction and ML decision heuristics.

> **Note**: The Vercel deployment performs 100% of URL analysis directly in the browser and does not require a Python backend, SQLite, or server-side API keys.

### Steps to Deploy to Vercel:

1. Push this project to GitHub
2. Import the repository into **Vercel** (`https://vercel.com/new`)
3. Select **Vite** as the framework preset
4. Build command:
   ```bash
   npm run build
   ```
5. Output directory:
   ```text
   dist
   ```
6. Click **Deploy**

The deployed site is 100% free, fast, fully functional, and stores scan histories locally in browser `localStorage`.

---

# Run Full Backend Locally

To run the complete full-stack environment with FastAPI, Python scikit-learn model, and SQLite:

### 1. Python & FastAPI Backend Setup

```bash
# 1. Create Python virtual environment
python -m venv venv

# 2. Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# 3. Install dependencies
pip install -r app/requirements.txt

# 4. (Optional) Retrain the local ML model
python ml/train.py

# 5. Launch FastAPI backend
uvicorn app.main:app --reload --port 8000
```

FastAPI Swagger documentation will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
# Install node packages
npm install

# Run Vite dev server
npm run dev
```

Visit `http://localhost:3000` to access the PhishGuard dashboard.

---

# Run with Docker & Docker Compose

Run the entire stack (FastAPI + React) locally with a single command:

```bash
docker compose up --build
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`

---

## 📜 License & Freedom

This project is licensed under the **MIT License**. It is completely free to modify, distribute, and self-host for personal, academic, or commercial security research.
