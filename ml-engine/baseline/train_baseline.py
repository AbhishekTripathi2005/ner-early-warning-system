"""
Baseline Machine Learning Model Training Module (Phase 1)
Trains Random Forest and XGBoost Classifiers on the synthetic NER dataset.
Calculates Precision, Recall, F1-score, ROC-AUC, and exports serialized artifacts.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report
)
from xgboost import XGBClassifier


def train_baseline_models():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "..", "data", "synthetic_landslide_ner_dataset.csv")

    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}. Run generate_dataset.py first.")

    df = pd.read_csv(data_path)

    # Define Feature Sets
    numeric_features = [
        "rainfall_24h",
        "rainfall_48h",
        "soil_moisture",
        "slope",
        "elevation",
        "distance_to_road"
    ]
    categorical_features = ["land_use"]
    target = "historical_landslide"

    X = df[numeric_features + categorical_features]
    y = df[target]

    # Stratified Train-Test Split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(drop="first", sparse_output=False), categorical_features)
        ]
    )

    # 1. Random Forest Pipeline
    rf_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(
            n_estimators=120,
            max_depth=8,
            min_samples_split=4,
            random_state=42
        ))
    ])

    print("Training Random Forest Classifier...")
    rf_pipeline.fit(X_train, y_train)
    rf_preds = rf_pipeline.predict(X_test)
    rf_probs = rf_pipeline.predict_proba(X_test)[:, 1]

    rf_metrics = {
        "model": "Random Forest Classifier",
        "accuracy": round(float(accuracy_score(y_test, rf_preds)), 4),
        "precision": round(float(precision_score(y_test, rf_preds)), 4),
        "recall": round(float(recall_score(y_test, rf_preds)), 4),
        "f1_score": round(float(f1_score(y_test, rf_preds)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, rf_probs)), 4)
    }

    # 2. XGBoost Pipeline
    xgb_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", XGBClassifier(
            n_estimators=100,
            learning_rate=0.08,
            max_depth=4,
            subsample=0.85,
            colsample_bytree=0.85,
            eval_metric="logloss",
            random_state=42
        ))
    ])

    print("Training XGBoost Classifier...")
    xgb_pipeline.fit(X_train, y_train)
    xgb_preds = xgb_pipeline.predict(X_test)
    xgb_probs = xgb_pipeline.predict_proba(X_test)[:, 1]

    xgb_metrics = {
        "model": "XGBoost Classifier",
        "accuracy": round(float(accuracy_score(y_test, xgb_preds)), 4),
        "precision": round(float(precision_score(y_test, xgb_preds)), 4),
        "recall": round(float(recall_score(y_test, xgb_preds)), 4),
        "f1_score": round(float(f1_score(y_test, xgb_preds)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, xgb_probs)), 4)
    }

    # Extract Feature Importances
    fitted_preprocessor = rf_pipeline.named_steps["preprocessor"]
    cat_encoder = fitted_preprocessor.named_transformers_["cat"]
    cat_feature_names = list(cat_encoder.get_feature_names_out(categorical_features))
    all_feature_names = numeric_features + cat_feature_names

    rf_importances = dict(zip(
        all_feature_names,
        [round(float(v), 4) for v in rf_pipeline.named_steps["classifier"].feature_importances_]
    ))
    xgb_importances = dict(zip(
        all_feature_names,
        [round(float(v), 4) for v in xgb_pipeline.named_steps["classifier"].feature_importances_]
    ))

    # Save artifacts
    artifacts_dir = os.path.join(base_dir, "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    rf_model_path = os.path.join(artifacts_dir, "baseline_rf_model.joblib")
    joblib.dump(rf_pipeline, rf_model_path)

    xgb_model_path = os.path.join(artifacts_dir, "baseline_xgb_model.joblib")
    joblib.dump(xgb_pipeline, xgb_model_path)

    report = {
        "evaluation_summary": {
            "random_forest": rf_metrics,
            "xgboost": xgb_metrics
        },
        "feature_importances": {
            "random_forest": rf_importances,
            "xgboost": xgb_importances
        },
        "training_metadata": {
            "total_samples": len(df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "features_used": all_feature_names
        }
    }

    report_path = os.path.join(base_dir, "model_evaluation_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)

    print("\n" + "="*50)
    print("BASELINE ML MODEL PERFORMANCE REPORT")
    print("="*50)
    print(f"Random Forest -> Precision: {rf_metrics['precision']:.4f} | Recall: {rf_metrics['recall']:.4f} | F1: {rf_metrics['f1_score']:.4f} | ROC-AUC: {rf_metrics['roc_auc']:.4f}")
    print(f"XGBoost       -> Precision: {xgb_metrics['precision']:.4f} | Recall: {xgb_metrics['recall']:.4f} | F1: {xgb_metrics['f1_score']:.4f} | ROC-AUC: {xgb_metrics['roc_auc']:.4f}")
    print("="*50)
    print(f"Models and metrics successfully saved to {artifacts_dir}")

    return report


if __name__ == "__main__":
    train_baseline_models()
