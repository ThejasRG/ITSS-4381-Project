from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
import csv
import uuid
from collections import defaultdict
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production

FILENAME = 'calories.csv'

# ===============================
# Meal Class
# ===============================
class Meal:
    def __init__(self, food_name, calories, protein, carbs, fats, date, meal_type):
        self.transaction_id = str(uuid.uuid4())[:8]
        self.food_name = food_name
        self.calories = float(calories)
        self.protein = float(protein)
        self.carbs = float(carbs)
        self.fats = float(fats)
        self.date = date
        self.meal_type = meal_type

    def to_list(self):
        return [
            self.transaction_id,
            self.food_name,
            str(self.calories),
            str(self.protein),
            str(self.carbs),
            str(self.fats),
            self.date,
            self.meal_type
        ]

    @classmethod
    def from_list(cls, row):
        return cls(
            food_name=row[1],
            calories=float(row[2]),
            protein=float(row[3]),
            carbs=float(row[4]),
            fats=float(row[5]),
            date=row[6],
            meal_type=row[7]
        )

# ===============================
# File Functions
# ===============================
def save_meal(meal):
    with open(FILENAME, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(meal.to_list())

def load_meals():
    try:
        with open(FILENAME, 'r') as file:
            return [row for row in csv.reader(file)]
    except FileNotFoundError:
        return []

def save_all(meals):
    with open(FILENAME, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(meals)

def get_statistics():
    meals = load_meals()
    if not meals:
        return {
            'total_calories': 0,
            'total_protein': 0,
            'total_carbs': 0,
            'total_fats': 0,
            'average_daily_calories': 0,
            'total_meals': 0
        }

    total_calories = total_protein = total_carbs = total_fats = 0
    date_totals = defaultdict(int)

    for row in meals:
        try:
            total_calories += float(row[2])
            total_protein += float(row[3])
            total_carbs += float(row[4])
            total_fats += float(row[5])
            date_totals[row[6]] += 1
        except (ValueError, IndexError):
            continue

    return {
        'total_calories': round(total_calories, 2),
        'total_protein': round(total_protein, 2),
        'total_carbs': round(total_carbs, 2),
        'total_fats': round(total_fats, 2),
        'average_daily_calories': round(total_calories / len(date_totals), 2) if date_totals else 0,
        'total_meals': len(meals)
    }

# ===============================
# Routes
# ===============================
@app.route('/')
def index():
    stats = get_statistics()
    meals = load_meals()
    return render_template('index.html', stats=stats, meals=meals)

@app.route('/add_meal', methods=['GET', 'POST'])
def add_meal():
    if request.method == 'POST':
        try:
            food_name = request.form['food_name']
            calories = float(request.form['calories'])
            protein = float(request.form['protein'])
            carbs = float(request.form['carbs'])
            fats = float(request.form['fats'])
            date = request.form['date']
            meal_type = request.form['meal_type']

            meal = Meal(food_name, calories, protein, carbs, fats, date, meal_type)
            save_meal(meal)
            flash('Meal added successfully!', 'success')
            return redirect(url_for('index'))
        except ValueError:
            flash('Please enter valid numbers for nutritional values.', 'error')
        except Exception as e:
            flash(f'Error adding meal: {str(e)}', 'error')
    
    return render_template('add_meal.html')

@app.route('/view_meals')
def view_meals():
    meals = load_meals()
    filter_type = request.args.get('meal_type', '')
    filter_date = request.args.get('date', '')
    
    if filter_type or filter_date:
        filtered_meals = []
        for row in meals:
            if filter_type and filter_type.lower() not in row[7].lower():
                continue
            if filter_date and filter_date != row[6]:
                continue
            filtered_meals.append(row)
        meals = filtered_meals
    
    return render_template('view_meals.html', meals=meals, filter_type=filter_type, filter_date=filter_date)

@app.route('/modify_meal/<meal_id>', methods=['GET', 'POST'])
def modify_meal(meal_id):
    meals = load_meals()
    meal_to_modify = None
    
    for row in meals:
        if row[0] == meal_id:
            meal_to_modify = row
            break
    
    if not meal_to_modify:
        flash('Meal not found.', 'error')
        return redirect(url_for('view_meals'))
    
    if request.method == 'POST':
        try:
            # Update the meal data
            meal_to_modify[1] = request.form['food_name']
            meal_to_modify[2] = request.form['calories']
            meal_to_modify[3] = request.form['protein']
            meal_to_modify[4] = request.form['carbs']
            meal_to_modify[5] = request.form['fats']
            meal_to_modify[6] = request.form['date']
            meal_to_modify[7] = request.form['meal_type']
            
            save_all(meals)
            flash('Meal updated successfully!', 'success')
            return redirect(url_for('view_meals'))
        except Exception as e:
            flash(f'Error updating meal: {str(e)}', 'error')
    
    return render_template('modify_meal.html', meal=meal_to_modify)

@app.route('/delete_meal/<meal_id>')
def delete_meal(meal_id):
    meals = load_meals()
    meals = [meal for meal in meals if meal[0] != meal_id]
    save_all(meals)
    flash('Meal deleted successfully!', 'success')
    return redirect(url_for('view_meals'))

@app.route('/statistics')
def statistics():
    stats = get_statistics()
    meals = load_meals()
    
    # Group meals by date for daily breakdown
    daily_stats = defaultdict(lambda: {'calories': 0, 'protein': 0, 'carbs': 0, 'fats': 0, 'meals': 0})
    for row in meals:
        try:
            daily_stats[row[6]]['calories'] += float(row[2])
            daily_stats[row[6]]['protein'] += float(row[3])
            daily_stats[row[6]]['carbs'] += float(row[4])
            daily_stats[row[6]]['fats'] += float(row[5])
            daily_stats[row[6]]['meals'] += 1
        except (ValueError, IndexError):
            continue
    
    return render_template('statistics.html', stats=stats, daily_stats=dict(daily_stats))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)