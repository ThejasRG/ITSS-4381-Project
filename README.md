# Calorie Tracker Web App

This repository contains a simple calorie tracking application built with Python and Streamlit.

## Features

* Add new meals with macronutrient breakdown.
* View logged meals with optional filters by date and meal type.
* Modify existing meals directly from the interface.
* View overall nutrition statistics including total calories/macros and average daily calories.

## Getting Started

1. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application**

   ```bash
   streamlit run app.py
   ```

3. **Open in browser**

   After the command starts, Streamlit will output a local URL (by default `http://localhost:8501`). Open it in your browser to use the app.

## Data Persistence

Meal entries are stored in a local CSV file named `calories.csv` in the project root. You can back up or edit this file externally if needed.