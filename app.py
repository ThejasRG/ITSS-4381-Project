#!/usr/bin/env python3
"""Streamlit front-end for the Calorie Tracker.

Run with:
    streamlit run app.py
"""
import streamlit as st
from datetime import date
from typing import List

from calorie_tracker import Meal, load_meals, save_meal, save_all, compute_statistics

ST_PAGE_TITLE = "Calorie Tracker Web"

st.set_page_config(page_title=ST_PAGE_TITLE, page_icon="🍎", layout="centered")
st.title(ST_PAGE_TITLE)


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def _render_meal_table(meals: List[Meal]):
    if not meals:
        st.info("No meals recorded yet.")
        return
    # convert to dicts for st.dataframe
    rows = [
        {
            "ID": m.transaction_id,
            "Date": m.date,
            "Meal": m.meal_type,
            "Food": m.food_name,
            "Calories": m.calories,
            "Protein (g)": m.protein,
            "Carbs (g)": m.carbs,
            "Fats (g)": m.fats,
        }
        for m in meals
    ]
    st.dataframe(rows, use_container_width=True)


# ---------------------------------------------------------------------------
# Sidebar for navigation
# ---------------------------------------------------------------------------
menu_choice = st.sidebar.radio(
    "Navigate", ["Add Meal", "View Meals", "Modify Meal", "Statistics"]
)


# ---------------------------------------------------------------------------
# Add Meal page
# ---------------------------------------------------------------------------
if menu_choice == "Add Meal":
    st.subheader("Add New Meal")
    with st.form("add_meal_form"):
        col1, col2 = st.columns(2)
        with col1:
            food_name = st.text_input("Food Name", max_chars=50)
            calories = st.number_input("Calories", min_value=0.0, step=1.0)
            protein = st.number_input("Protein (g)", min_value=0.0, step=0.1)
        with col2:
            carbs = st.number_input("Carbs (g)", min_value=0.0, step=0.1)
            fats = st.number_input("Fats (g)", min_value=0.0, step=0.1)
            meal_type = st.selectbox("Meal Type", ["Breakfast", "Lunch", "Dinner", "Snack"])
        meal_date = st.date_input("Date", value=date.today())

        submitted = st.form_submit_button("Save Meal")
        if submitted:
            if not food_name:
                st.error("Food name is required.")
            else:
                meal = Meal(
                    food_name=food_name,
                    calories=calories,
                    protein=protein,
                    carbs=carbs,
                    fats=fats,
                    date=str(meal_date),
                    meal_type=meal_type,
                )
                save_meal(meal)
                st.success(f"Meal '{food_name}' saved!")

# ---------------------------------------------------------------------------
# View Meals page
# ---------------------------------------------------------------------------
elif menu_choice == "View Meals":
    st.subheader("Logged Meals")
    all_meals = load_meals()

    # filters
    with st.expander("Filters", expanded=False):
        col1, col2 = st.columns(2)
        with col1:
            filter_type = st.multiselect(
                "Meal Type", ["Breakfast", "Lunch", "Dinner", "Snack"]
            )
        with col2:
            filter_date = st.date_input("Date", value=None)

    filtered = []
    for m in all_meals:
        if filter_type and m.meal_type not in filter_type:
            continue
        if filter_date and str(filter_date) != m.date:
            continue
        filtered.append(m)

    _render_meal_table(filtered)

# ---------------------------------------------------------------------------
# Modify Meal page
# ---------------------------------------------------------------------------
elif menu_choice == "Modify Meal":
    st.subheader("Modify Existing Meal")
    meals = load_meals()
    if not meals:
        st.info("No meals to modify.")
    else:
        ids = [m.transaction_id for m in meals]
        selected_id = st.selectbox("Select Meal ID", ids)
        meal = next(m for m in meals if m.transaction_id == selected_id)

        with st.form("modify_meal_form"):
            col1, col2 = st.columns(2)
            with col1:
                food_name = st.text_input("Food Name", value=meal.food_name)
                calories = st.number_input("Calories", value=meal.calories, min_value=0.0)
                protein = st.number_input("Protein (g)", value=meal.protein, min_value=0.0)
            with col2:
                carbs = st.number_input("Carbs (g)", value=meal.carbs, min_value=0.0)
                fats = st.number_input("Fats (g)", value=meal.fats, min_value=0.0)
                meal_type = st.selectbox(
                    "Meal Type",
                    ["Breakfast", "Lunch", "Dinner", "Snack"],
                    index=["Breakfast", "Lunch", "Dinner", "Snack"].index(meal.meal_type),
                )
            meal_date = st.date_input("Date", value=date.fromisoformat(meal.date))

            submitted = st.form_submit_button("Update Meal")
            if submitted:
                # mutate selected meal
                meal.food_name = food_name
                meal.calories = calories
                meal.protein = protein
                meal.carbs = carbs
                meal.fats = fats
                meal.meal_type = meal_type
                meal.date = str(meal_date)

                save_all(meals)
                st.success("Meal updated successfully!")

# ---------------------------------------------------------------------------
# Statistics page
# ---------------------------------------------------------------------------
elif menu_choice == "Statistics":
    st.subheader("Nutrition Summary")
    stats = compute_statistics(load_meals())
    if not stats:
        st.info("No data available to compute statistics.")
    else:
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Total Calories", f"{stats['total_calories']:.2f} kcal")
            st.metric("Total Protein", f"{stats['total_protein']:.2f} g")
            st.metric("Total Carbs", f"{stats['total_carbs']:.2f} g")
            st.metric("Total Fats", f"{stats['total_fats']:.2f} g")
        with col2:
            st.metric("Avg Daily Calories", f"{stats['avg_daily_calories']:.2f} kcal")