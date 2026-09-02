"""
PhishGuard - SQLite Database Layer
100% Free & Local Database with zero configuration or cloud dependencies.
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "phishguard.db")


def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initializes local SQLite tables."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        risk_score REAL NOT NULL,
        classification TEXT NOT NULL,
        is_https INTEGER NOT NULL,
        domain_entropy REAL NOT NULL,
        suspicious_keyword_count INTEGER NOT NULL,
        features_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scan_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_scans INTEGER DEFAULT 0,
        phishing_detected INTEGER DEFAULT 0,
        suspicious_detected INTEGER DEFAULT 0,
        safe_detected INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()


def save_scan_result(url: str, risk_score: float, classification: str, features: Dict[str, Any]) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO scans (url, risk_score, classification, is_https, domain_entropy, suspicious_keyword_count, features_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        url,
        risk_score,
        classification,
        features.get("is_https", 0),
        features.get("domain_entropy", 0.0),
        features.get("suspicious_keyword_count", 0),
        json.dumps(features),
        datetime.utcnow().isoformat()
    ))
    
    scan_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return scan_id


def get_scan_history(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT id, url, risk_score, classification, is_https, domain_entropy, suspicious_keyword_count, features_json, created_at
    FROM scans
    ORDER BY id DESC
    LIMIT ?
    """, (limit,))
    
    rows = cursor.fetchall()
    results = []
    for r in rows:
        item = dict(r)
        try:
            item["features"] = json.loads(item["features_json"])
        except Exception:
            item["features"] = {}
        results.append(item)
        
    conn.close()
    return results


def get_scan_summary() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as total FROM scans")
    total = cursor.fetchone()["total"]
    
    cursor.execute("SELECT COUNT(*) as phishing FROM scans WHERE classification = 'PHISHING'")
    phishing = cursor.fetchone()["phishing"]
    
    cursor.execute("SELECT COUNT(*) as suspicious FROM scans WHERE classification = 'SUSPICIOUS'")
    suspicious = cursor.fetchone()["suspicious"]
    
    cursor.execute("SELECT COUNT(*) as safe FROM scans WHERE classification = 'SAFE'")
    safe = cursor.fetchone()["safe"]
    
    cursor.execute("SELECT AVG(risk_score) as avg_risk FROM scans")
    avg_risk_row = cursor.fetchone()["avg_risk"]
    avg_risk = round(avg_risk_row, 2) if avg_risk_row else 0.0
    
    conn.close()
    return {
        "total_scans": total,
        "phishing_count": phishing,
        "suspicious_count": suspicious,
        "safe_count": safe,
        "avg_risk_score": avg_risk
    }


def clear_history_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scans")
    conn.commit()
    conn.close()


# Auto-initialize on import
init_db()
