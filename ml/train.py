"""
PhishGuard - Random Forest Model Trainer
Trains a lightweight, fast, offline Random Forest Classifier using scikit-learn.
Saves model artifacts to ml/model/phishing_classifier.joblib with zero paid tools.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score

FEATURE_COLUMNS = [
    "url_length",
    "domain_length",
    "num_subdomains",
    "num_dots",
    "num_hyphens",
    "num_digits",
    "num_special_chars",
    "has_at_symbol",
    "is_ip_address",
    "is_https",
    "suspicious_keyword_count",
    "domain_entropy",
    "is_shortener",
    "query_param_count",
    "path_length"
]


def train_model():
    dataset_path = os.path.join(os.path.dirname(__file__), "dataset", "phishing_dataset.csv")
    model_dir = os.path.join(os.path.dirname(__file__), "model")
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "phishing_classifier.joblib")

    print(f"[+] Loading dataset from {dataset_path}...")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")

    df = pd.read_csv(dataset_path)
    X = df[FEATURE_COLUMNS]
    y = df["label"]

    print(f"[+] Total samples: {len(df)} (Phishing: {sum(y == 1)}, Legitimate: {sum(y == 0)})")

    # Stratified Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # Lightweight Random Forest (Fast inference, Low RAM, Free execution)
    rf = RandomForestClassifier(
        n_estimators=50,
        max_depth=8,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )

    print("[+] Training Random Forest Classifier...")
    rf.fit(X_train, y_train)

    # Evaluation
    y_pred = rf.predict(X_test)
    y_proba = rf.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    roc = roc_auc_score(y_test, y_proba)
    cv_scores = cross_val_score(rf, X, y, cv=5)

    print("\n================ ML MODEL PERFORMANCE ================")
    print(f"Accuracy:        {acc * 100:.2f}%")
    print(f"ROC-AUC Score:   {roc:.4f}")
    print(f"5-Fold CV Mean:  {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    # Feature Importances
    importances = pd.Series(rf.feature_importances_, index=FEATURE_COLUMNS).sort_values(ascending=False)
    print("\nTop Feature Importances:")
    for feat, imp in importances.items():
        print(f"  - {feat:25s}: {imp:.4f}")

    # Serialize Model + Metadata
    artifact = {
        "model": rf,
        "features": FEATURE_COLUMNS,
        "importances": importances.to_dict(),
        "metrics": {
            "accuracy": float(acc),
            "roc_auc": float(roc),
            "cv_mean": float(cv_scores.mean()),
            "cv_std": float(cv_scores.std()),
            "samples_count": len(df)
        }
    }

    joblib.dump(artifact, model_path)
    print(f"\n[✓] Saved lightweight model artifact to {model_path} successfully!")
    print("[✓] Zero external dependencies or paid APIs required.")


if __name__ == "__main__":
    train_model()
