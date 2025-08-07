from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
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
    def from_list(cls, data):
        return cls(data[1], data[2], data[3], data[4], data[5], data[6], data[7])

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
    return render_template('index.html', stats=stats)

@app.route('/meals')
def meals():
    all_meals = load_meals()
    meals_data = []
    
    for row in all_meals:
        if len(row) >= 8:
            meals_data.append({
                'id': row[0],
                'food_name': row[1],
                'calories': row[2],
                'protein': row[3],
                'carbs': row[4],
                'fats': row[5],
                'date': row[6],
                'meal_type': row[7]
            })
    
    return render_template('meals.html', meals=meals_data)

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
            return redirect(url_for('meals'))
        except ValueError:
            flash('Please enter valid numbers for nutritional values.', 'error')
        except Exception as e:
            flash(f'Error adding meal: {str(e)}', 'error')
    
    return render_template('add_meal.html')

@app.route('/edit_meal/<meal_id>', methods=['GET', 'POST'])
def edit_meal(meal_id):
    meals = load_meals()
    meal_data = None
    
    for row in meals:
        if row[0] == meal_id:
            meal_data = {
                'id': row[0],
                'food_name': row[1],
                'calories': row[2],
                'protein': row[3],
                'carbs': row[4],
                'fats': row[5],
                'date': row[6],
                'meal_type': row[7]
            }
            break
    
    if not meal_data:
        flash('Meal not found.', 'error')
        return redirect(url_for('meals'))
    
    if request.method == 'POST':
        try:
            meal_data['food_name'] = request.form['food_name']
            meal_data['calories'] = float(request.form['calories'])
            meal_data['protein'] = float(request.form['protein'])
            meal_data['carbs'] = float(request.form['carbs'])
            meal_data['fats'] = float(request.form['fats'])
            meal_data['date'] = request.form['date']
            meal_data['meal_type'] = request.form['meal_type']
            
            # Update the meal in the list
            for i, row in enumerate(meals):
                if row[0] == meal_id:
                    meals[i] = [
                        meal_id,
                        meal_data['food_name'],
                        str(meal_data['calories']),
                        str(meal_data['protein']),
                        str(meal_data['carbs']),
                        str(meal_data['fats']),
                        meal_data['date'],
                        meal_data['meal_type']
                    ]
                    break
            
            save_all(meals)
            flash('Meal updated successfully!', 'success')
            return redirect(url_for('meals'))
        except ValueError:
            flash('Please enter valid numbers for nutritional values.', 'error')
        except Exception as e:
            flash(f'Error updating meal: {str(e)}', 'error')
    
    return render_template('edit_meal.html', meal=meal_data)

@app.route('/delete_meal/<meal_id>', methods=['POST'])
def delete_meal(meal_id):
    meals = load_meals()
    updated_meals = [row for row in meals if row[0] != meal_id]
    
    if len(updated_meals) < len(meals):
        save_all(updated_meals)
        flash('Meal deleted successfully!', 'success')
    else:
        flash('Meal not found.', 'error')
    
    return redirect(url_for('meals'))

@app.route('/api/stats')
def api_stats():
    return jsonify(get_statistics())

@app.route('/api/meals')
def api_meals():
    meals = load_meals()
    meals_data = []
    
    for row in meals:
        if len(row) >= 8:
            meals_data.append({
                'id': row[0],
                'food_name': row[1],
                'calories': row[2],
                'protein': row[3],
                'carbs': row[4],
                'fats': row[5],
                'date': row[6],
                'meal_type': row[7]
            })
    
    return jsonify(meals_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)