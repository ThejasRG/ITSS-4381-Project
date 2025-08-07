from flask import Flask, render_template, request, jsonify
import csv
import uuid
from collections import defaultdict
import os
from datetime import datetime

app = Flask(__name__)

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
    
    def to_dict(self):
        return {
            'id': self.transaction_id,
            'food_name': self.food_name,
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fats': self.fats,
            'date': self.date,
            'meal_type': self.meal_type
        }

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

# ===============================
# Routes
# ===============================
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/meals', methods=['GET'])
def get_meals():
    meals = load_meals()
    meal_dicts = []
    
    for row in meals:
        if len(row) >= 8:
            meal_dict = {
                'id': row[0],
                'food_name': row[1],
                'calories': float(row[2]),
                'protein': float(row[3]),
                'carbs': float(row[4]),
                'fats': float(row[5]),
                'date': row[6],
                'meal_type': row[7]
            }
            meal_dicts.append(meal_dict)
    
    return jsonify(meal_dicts)

@app.route('/api/meals', methods=['POST'])
def add_meal():
    try:
        data = request.get_json()
        
        meal = Meal(
            food_name=data['food_name'],
            calories=data['calories'],
            protein=data['protein'],
            carbs=data['carbs'],
            fats=data['fats'],
            date=data['date'],
            meal_type=data['meal_type']
        )
        
        save_meal(meal)
        return jsonify({'success': True, 'meal': meal.to_dict()}), 201
        
    except (KeyError, ValueError) as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/meals/<meal_id>', methods=['PUT'])
def modify_meal(meal_id):
    try:
        meals = load_meals()
        data = request.get_json()
        
        for row in meals:
            if row[0] == meal_id:
                row[1] = data.get('food_name', row[1])
                row[2] = str(data.get('calories', row[2]))
                row[3] = str(data.get('protein', row[3]))
                row[4] = str(data.get('carbs', row[4]))
                row[5] = str(data.get('fats', row[5]))
                row[6] = data.get('date', row[6])
                row[7] = data.get('meal_type', row[7])
                
                save_all(meals)
                return jsonify({'success': True}), 200
        
        return jsonify({'success': False, 'error': 'Meal not found'}), 404
        
    except (ValueError) as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/meals/<meal_id>', methods=['DELETE'])
def delete_meal(meal_id):
    meals = load_meals()
    
    for i, row in enumerate(meals):
        if row[0] == meal_id:
            meals.pop(i)
            save_all(meals)
            return jsonify({'success': True}), 200
    
    return jsonify({'success': False, 'error': 'Meal not found'}), 404

@app.route('/api/statistics')
def get_statistics():
    meals = load_meals()
    if not meals:
        return jsonify({
            'total_calories': 0,
            'total_protein': 0,
            'total_carbs': 0,
            'total_fats': 0,
            'average_daily_calories': 0,
            'meals_count': 0
        })

    total_calories = total_protein = total_carbs = total_fats = 0
    date_totals = defaultdict(lambda: {'calories': 0, 'count': 0})

    for row in meals:
        try:
            calories = float(row[2])
            protein = float(row[3])
            carbs = float(row[4])
            fats = float(row[5])
            date = row[6]
            
            total_calories += calories
            total_protein += protein
            total_carbs += carbs
            total_fats += fats
            
            date_totals[date]['calories'] += calories
            date_totals[date]['count'] += 1
            
        except (ValueError, IndexError):
            continue

    average_daily_calories = total_calories / len(date_totals) if date_totals else 0

    return jsonify({
        'total_calories': round(total_calories, 2),
        'total_protein': round(total_protein, 2),
        'total_carbs': round(total_carbs, 2),
        'total_fats': round(total_fats, 2),
        'average_daily_calories': round(average_daily_calories, 2),
        'meals_count': len(meals),
        'daily_breakdown': dict(date_totals)
    })

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)