#!/usr/bin/env python3
"""Calorie Tracker core library.

This module provides the Meal dataclass and helper functions to persist meals
into a CSV file. It mirrors the logic developed in the original notebook so
that other front-ends (CLI, Streamlit, etc.) can reuse the same core
functionality.
"""
import csv
import uuid
from collections import defaultdict
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Dict, Any

# Default location for the CSV file (placed in the same directory as this module)
DATA_FILE = Path(__file__).with_name("calories.csv")


def _ensure_file_exists() -> None:
    """Create the CSV file if it doesn't exist already (including header)."""
    if not DATA_FILE.exists():
        # Write header row for easier readability if file is opened manually.
        DATA_FILE.write_text(
            "transaction_id,food_name,calories,protein,carbs,fats,date,meal_type\n",
            encoding="utf-8",
        )


@dataclass
class Meal:
    food_name: str
    calories: float
    protein: float
    carbs: float
    fats: float
    date: str  # YYYY-MM-DD
    meal_type: str  # Breakfast/Lunch/Dinner/Snack/…
    transaction_id: str = ""

    def __post_init__(self) -> None:
        if not self.transaction_id:
            # Generate short unique ID
            self.transaction_id = str(uuid.uuid4())[:8]

    @classmethod
    def from_row(cls, row: List[str]) -> "Meal":
        """Construct a Meal instance from a CSV row."""
        return cls(
            transaction_id=row[0],
            food_name=row[1],
            calories=float(row[2]),
            protein=float(row[3]),
            carbs=float(row[4]),
            fats=float(row[5]),
            date=row[6],
            meal_type=row[7],
        )

    def to_row(self) -> List[str]:
        """Return list representation suitable for CSV writer."""
        return [
            self.transaction_id,
            self.food_name,
            f"{self.calories}",
            f"{self.protein}",
            f"{self.carbs}",
            f"{self.fats}",
            self.date,
            self.meal_type,
        ]


# ---------------------------------------------------------------------------
# Persistence helpers
# ---------------------------------------------------------------------------

def load_meals() -> List[Meal]:
    _ensure_file_exists()
    meals: List[Meal] = []
    with DATA_FILE.open(newline="", encoding="utf-8") as file:
        reader = csv.reader(file)
        for i, row in enumerate(reader):
            # Skip header row if present
            if i == 0 and row and row[0] == "transaction_id":
                continue
            if len(row) != 8:
                # Skip malformed rows
                continue
            try:
                meals.append(Meal.from_row(row))
            except ValueError:
                # Skip rows containing invalid data
                continue
    return meals


def save_meal(meal: Meal) -> None:
    """Append a meal to the CSV file."""
    _ensure_file_exists()
    with DATA_FILE.open("a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(meal.to_row())


def save_all(meals: List[Meal]) -> None:
    """Overwrite CSV file with full list of meals."""
    _ensure_file_exists()
    with DATA_FILE.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        # Write header
        writer.writerow([
            "transaction_id",
            "food_name",
            "calories",
            "protein",
            "carbs",
            "fats",
            "date",
            "meal_type",
        ])
        for meal in meals:
            writer.writerow(meal.to_row())


# ---------------------------------------------------------------------------
# Statistics helpers
# ---------------------------------------------------------------------------

def compute_statistics(meals: List[Meal]) -> Dict[str, Any]:
    """Compute aggregate stats for a list of meals."""
    if not meals:
        return {}
    total_calories = sum(m.calories for m in meals)
    total_protein = sum(m.protein for m in meals)
    total_carbs = sum(m.carbs for m in meals)
    total_fats = sum(m.fats for m in meals)

    # Count distinct dates with entries
    dates = {m.date for m in meals}
    avg_daily_calories = total_calories / len(dates) if dates else 0.0

    return {
        "total_calories": total_calories,
        "total_protein": total_protein,
        "total_carbs": total_carbs,
        "total_fats": total_fats,
        "avg_daily_calories": avg_daily_calories,
    }