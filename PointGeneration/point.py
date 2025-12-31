#!/usr/bin/env python3
"""
point_conversion.py

Stage 2: Rule-based point generation for LLM input (intent-only, CCTV).
Inputs (from Stage 1):
- zone_visits.csv
- interactions.csv
- tracks.csv
- frame_metrics.csv (optional, not required by current rules)

Outputs (Stage 2):
- zone_points.csv
- product_points.csv

IMPORTANT SEMANTICS:
- interactions.Outcome == "BOUGHT" is treated as "walked away holding item" (HIGH INTENT),
  NOT a verified sale yet. Verified sales will be merged later from bill-counter CSV. [file-based behavior]
"""

import argparse
import pandas as pd


# -----------------------------
# Helpers
# -----------------------------
def safe_div(a: float, b: float, default: float = 0.0) -> float:
    if b is None or b == 0 or pd.isna(b):
        return default
    return a / b


# -----------------------------
# Scoring rules (from ConvertionSystem.txt)
# -----------------------------
def dwell_points(seconds: float) -> int:
    # Baseline: 0-10 seconds = 1pt, 10-30s = 3pts, 30-60s = 5pts, 60s+ = 10pts. [file:29]
    if seconds is None or pd.isna(seconds):
        return 0
    s = float(seconds)
    if s < 0:
        return 0
    if s < 10:
        return 1
    if s < 30:
        return 3
    if s < 60:
        return 5
    return 10


def repeat_multiplier(n_visits: int) -> float:
    # Repeat score: 1st visit = 1x, 2nd = 1.2x, 3rd+ = 1.5x multiplier. [file:29]
    if n_visits <= 1:
        return 1.0
    if n_visits == 2:
        return 1.2
    return 1.5


def outcome_points_intent_only(outcome: str) -> int:
    """
    Intent-only scoring derived from your rules: [file:29]
    - Picked up item: +5 pts
    - Returned: -2 pts
    - Left in hand (walk away): -3 pts

    Current Stage 1 labels: [file:27]
    - BOUGHT => means 'walked away from shelf holding item' (intent event)
    Therefore:
      BOUGHT => +5 (pickup) -3 (left in hand) = +2 net intent points
      RETURNED => -2
    """
    o = str(outcome).upper()
    if o == "RETURNED":
        return -2
    if o == "BOUGHT":
        return 5 - 3
    return 0


def label_zone(score_0_100: float) -> str:
    s = float(score_0_100)
    if s >= 80:
        return "Premium Zone"
    if s >= 50:
        return "Standard Zone"
    if s >= 20:
        return "Underperforming"
    return "Critical Zone"


def label_item(score_0_100: float) -> str:
    s = float(score_0_100)
    if s >= 80:
        return "Buy More Now"
    if s >= 50:
        return "Stable Performer"
    if s >= 20:
        return "Declining Interest"
    return "Low Priority"


# -----------------------------
# Main
# -----------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--zone_visits", default="zone_visits.csv")
    ap.add_argument("--interactions", default="interactions.csv")
    ap.add_argument("--tracks", default="tracks.csv")
    ap.add_argument("--frame_metrics", default="frame_metrics.csv")  # optional; not used for now
    ap.add_argument("--out_zone", default="zone_points.csv")
    ap.add_argument("--out_product", default="product_points.csv")
    args = ap.parse_args()

    # ---- Load ----
    zone_visits = pd.read_csv(args.zone_visits)
    interactions = pd.read_csv(args.interactions)
    tracks = pd.read_csv(args.tracks)

    # ---- Normalize schema (based on your Stage 1 CSVs) ----
    # zone_visits.csv columns: CustomerID,Zone,EnterTime,ExitTime,DwellTime [file:26]
    zone_visits["CustomerID"] = zone_visits["CustomerID"].astype(int)
    zone_visits["Zone"] = zone_visits["Zone"].astype(str)
    zone_visits["EnterTime"] = zone_visits["EnterTime"].astype(float)
    zone_visits["ExitTime"] = zone_visits["ExitTime"].astype(float)
    zone_visits["DwellTime"] = zone_visits["DwellTime"].astype(float)

    # interactions.csv columns: CustomerID,Zone,StartTime,EndTime,HoldTime,Outcome,DetectedItem [file:27]
    interactions["CustomerID"] = interactions["CustomerID"].astype(int)
    interactions["Zone"] = interactions["Zone"].astype(str)
    interactions["Outcome"] = interactions["Outcome"].astype(str)
    if "HoldTime" in interactions.columns:
        interactions["HoldTime"] = interactions["HoldTime"].astype(float)
    else:
        interactions["HoldTime"] = 0.0

    if "DetectedItem" not in interactions.columns:
        interactions["DetectedItem"] = "UNKNOWN_PRODUCT"
    interactions["DetectedItem"] = interactions["DetectedItem"].fillna("UNKNOWN_PRODUCT").astype(str)

    # tracks.csv columns: CustomerID,EntryTime,ExitTime,TotalTime,... [file:28]
    tracks["CustomerID"] = tracks["CustomerID"].astype(int)
    tracks["EntryTime"] = tracks["EntryTime"].astype(float)
    tracks["ExitTime"] = tracks["ExitTime"].astype(float)

    # ---- Determine time window (for per-hour rates) ----
    # Uses span in zone_visits if possible; fallback to tracks. [file:26][file:28]
    if len(zone_visits) > 0:
        tmin = float(zone_visits["EnterTime"].min())
        tmax = float(zone_visits["ExitTime"].max())
    else:
        tmin = float(tracks["EntryTime"].min())
        tmax = float(tracks["ExitTime"].max())

    window_seconds = max(1.0, tmax - tmin)
    window_hours = window_seconds / 3600.0

    # =========================================================
    # ZONE-LEVEL FEATURES + POINTS
    # =========================================================

    # Basic zone stats
    zone_stats = zone_visits.groupby("Zone").agg(
        unique_customers=("CustomerID", "nunique"),
        total_visits=("CustomerID", "count"),
        total_dwell_s=("DwellTime", "sum"),
        avg_dwell_s=("DwellTime", "mean"),
        median_dwell_s=("DwellTime", "median"),
    ).reset_index()

    # Zone visit frequency normalization (0-10) [file:29]
    zone_stats["visits_per_hour"] = zone_stats["total_visits"] / window_hours
    max_vph = float(zone_stats["visits_per_hour"].max()) if len(zone_stats) else 0.0
    zone_stats["visit_freq_points_0_10"] = zone_stats["visits_per_hour"].apply(
        lambda v: 0.0 if max_vph <= 0 else (float(v) / max_vph) * 10.0
    )

    # Dwell points sum/avg
    zone_visits = zone_visits.copy()
    zone_visits["dwell_pts"] = zone_visits["DwellTime"].apply(dwell_points)

    zone_dwell = zone_visits.groupby("Zone").agg(
        dwell_points_sum=("dwell_pts", "sum"),
        dwell_points_avg=("dwell_pts", "mean"),
    ).reset_index()

    zone_stats = zone_stats.merge(zone_dwell, on="Zone", how="left")

    # Repeat + momentum (per customer-zone)
    zv = zone_visits.sort_values(["CustomerID", "Zone", "EnterTime"]).copy()
    zv["visit_index"] = zv.groupby(["CustomerID", "Zone"]).cumcount() + 1
    zv["repeat_mult"] = zv["visit_index"].apply(repeat_multiplier)

    zv["prev_dwell"] = zv.groupby(["CustomerID", "Zone"])["DwellTime"].shift(1)

    def momentum_pts(row) -> int:
        # Increasing dwell: +2, decreasing: -1 [file:29]
        if pd.isna(row["prev_dwell"]):
            return 0
        if row["DwellTime"] > row["prev_dwell"]:
            return 2
        if row["DwellTime"] < row["prev_dwell"]:
            return -1
        return 0

    zv["momentum_pts"] = zv.apply(momentum_pts, axis=1)

    zone_repeat = zv.groupby("Zone").agg(
        repeat_mult_avg=("repeat_mult", "mean"),
        momentum_points_sum=("momentum_pts", "sum"),
    ).reset_index()

    zone_stats = zone_stats.merge(zone_repeat, on="Zone", how="left").fillna(0)

    # Interaction points (intent-only)
    interactions = interactions.copy()
    interactions["interaction_pts"] = interactions["Outcome"].apply(outcome_points_intent_only)

    # Multiple pickups of same item: +7 bonus (high intent) [file:29]
    key_cols = ["CustomerID", "Zone", "DetectedItem"]
    interactions["interaction_rank"] = interactions.groupby(key_cols).cumcount() + 1
    interactions["multi_pick_bonus"] = interactions["interaction_rank"].apply(lambda r: 7 if r >= 2 else 0)
    interactions["interaction_pts"] = interactions["interaction_pts"] + interactions["multi_pick_bonus"]

    # Create an explicit "intent event" flag for later merge with bill sales CSV
    interactions["intent_event"] = interactions["Outcome"].str.upper().apply(lambda x: 1 if x == "BOUGHT" else 0)

    zone_inter = interactions.groupby("Zone").agg(
        interactions_count=("CustomerID", "count"),
        unique_interactors=("CustomerID", "nunique"),
        intent_count=("intent_event", "sum"),
        returned_count=("Outcome", lambda s: (s.str.upper() == "RETURNED").sum()),
        interaction_points_sum=("interaction_pts", "sum"),
        hold_time_sum=("HoldTime", "sum"),
        hold_time_avg=("HoldTime", "mean"),
    ).reset_index()

    zone_stats = zone_stats.merge(zone_inter, on="Zone", how="left").fillna(0)

    # Intent efficiency (intent/visits)*100 (NOT true sales yet) [file:29]
    zone_stats["intent_efficiency_pct"] = zone_stats.apply(
        lambda r: safe_div(r["intent_count"], r["total_visits"], 0.0) * 100.0, axis=1
    )
    # Scaled version (intent/visits)*10 (kept similar to txt "×10" convention) [file:29]
    zone_stats["intent_rate_x10"] = zone_stats.apply(
        lambda r: safe_div(r["intent_count"], r["total_visits"], 0.0) * 10.0, axis=1
    )

    # Engagement score (per customer-zone) composite:
    # Engagement_Score = (Dwell_pts×0.3) + (Pickup_pts×0.3) + (Repeat×0.2) + (EventBoost×0.2) [file:29]
    # We don't have EventBoost in Stage 1 => 0.
    pickup_counts = interactions.groupby(["CustomerID", "Zone"]).size().reset_index(name="pickup_events")
    cust_zone = zv.groupby(["CustomerID", "Zone"]).agg(
        dwell_pts=("dwell_pts", "sum"),
        repeat_mult=("repeat_mult", "max"),
        momentum_pts=("momentum_pts", "sum"),
    ).reset_index().merge(pickup_counts, on=["CustomerID", "Zone"], how="left").fillna({"pickup_events": 0})

    cust_zone["pickup_pts"] = cust_zone["pickup_events"] * 5.0  # pickup baseline +5 [file:29]
    cust_zone["event_boost"] = 0.0

    cust_zone["engagement_score_raw"] = (
        cust_zone["dwell_pts"] * 0.3 +
        cust_zone["pickup_pts"] * 0.3 +
        cust_zone["repeat_mult"] * 0.2 +
        cust_zone["event_boost"] * 0.2
    )

    zone_eng = cust_zone.groupby("Zone").agg(
        engagement_points_sum=("engagement_score_raw", "sum"),
        engagement_points_avg=("engagement_score_raw", "mean"),
    ).reset_index()

    zone_stats = zone_stats.merge(zone_eng, on="Zone", how="left").fillna(0)

    # Zone popularity normalize engagement to 0-100 [file:29]
    max_eng = float(zone_stats["engagement_points_sum"].max()) if len(zone_stats) else 0.0
    zone_stats["zone_popularity_0_100"] = zone_stats["engagement_points_sum"].apply(
        lambda x: 0.0 if max_eng <= 0 else (float(x) / max_eng) * 100.0
    )

    # Final Zone Score (partial): since Cross-Zone Affinity / Inventory Health / Trend not available yet [file:29]
    zone_stats["final_zone_score_partial_0_100"] = (
        zone_stats["zone_popularity_0_100"] * 0.40 +
        zone_stats["intent_efficiency_pct"].clip(upper=100) * 0.30 +
        (zone_stats["visit_freq_points_0_10"] * 10.0) * 0.30
    ).clip(lower=0, upper=100)

    zone_stats["zone_label"] = zone_stats["final_zone_score_partial_0_100"].apply(label_zone)

    zone_out = zone_stats[[
        "Zone",
        "unique_customers",
        "total_visits",
        "visits_per_hour",
        "visit_freq_points_0_10",
        "total_dwell_s",
        "avg_dwell_s",
        "median_dwell_s",
        "dwell_points_sum",
        "interaction_points_sum",
        "interactions_count",
        "intent_count",
        "returned_count",
        "intent_efficiency_pct",
        "intent_rate_x10",
        "repeat_mult_avg",
        "momentum_points_sum",
        "engagement_points_sum",
        "zone_popularity_0_100",
        "final_zone_score_partial_0_100",
        "zone_label",
    ]].copy()

    # =========================================================
    # PRODUCT-LEVEL FEATURES + POINTS
    # =========================================================
    prod = interactions.copy()
    prod["product"] = prod["DetectedItem"].fillna("UNKNOWN_PRODUCT")

    product_stats = prod.groupby("product").agg(
        interactions_count=("CustomerID", "count"),
        unique_customers=("CustomerID", "nunique"),
        intent_count=("intent_event", "sum"),
        returned_count=("Outcome", lambda s: (s.str.upper() == "RETURNED").sum()),
        hold_time_sum=("HoldTime", "sum"),
        hold_time_avg=("HoldTime", "mean"),
        points_sum=("interaction_pts", "sum"),
    ).reset_index()

    product_stats["intent_efficiency_pct"] = product_stats.apply(
        lambda r: safe_div(r["intent_count"], r["interactions_count"], 0.0) * 100.0, axis=1
    )

    # Partial item score (no trend/seasonality/affinity/event boost yet) [file:29]
    max_points = float(product_stats["points_sum"].max()) if len(product_stats) else 0.0
    product_stats["engagement_0_100"] = product_stats["points_sum"].apply(
        lambda x: 0.0 if max_points <= 0 else (float(x) / max_points) * 100.0
    )
    product_stats["final_item_score_partial_0_100"] = (
        product_stats["engagement_0_100"] * 0.60 +
        product_stats["intent_efficiency_pct"].clip(upper=100) * 0.40
    ).clip(lower=0, upper=100)

    product_stats["item_label"] = product_stats["final_item_score_partial_0_100"].apply(label_item)

    product_out = product_stats[[
        "product",
        "unique_customers",
        "interactions_count",
        "intent_count",
        "returned_count",
        "hold_time_sum",
        "hold_time_avg",
        "points_sum",
        "intent_efficiency_pct",
        "engagement_0_100",
        "final_item_score_partial_0_100",
        "item_label",
    ]].copy()

    # ---- Write outputs (only 2 CSV files) ----
    zone_out.to_csv(args.out_zone, index=False)
    product_out.to_csv(args.out_product, index=False)

    print("✅ Generated:")
    print(" -", args.out_zone)
    print(" -", args.out_product)
    print(f"Window: {window_seconds:.2f}s ({window_hours:.6f}h)")

if __name__ == "__main__":
    main()
