// Calorie Tracker App JavaScript

class CalorieTracker {
    constructor() {
        this.foods = JSON.parse(localStorage.getItem('calorieTracker_foods')) || [];
        this.dailyGoal = parseInt(localStorage.getItem('calorieTracker_goal')) || 2000;
        this.currentDate = new Date().toDateString();
        
        this.initializeApp();
        this.bindEvents();
        this.updateDashboard();
    }

    initializeApp() {
        // Filter foods for today only
        this.todaysFoods = this.foods.filter(food => 
            new Date(food.date).toDateString() === this.currentDate
        );
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Add food form
        document.getElementById('add-food-form').addEventListener('submit', (e) => this.addFood(e));

        // Search functionality
        document.getElementById('food-search').addEventListener('input', (e) => this.searchFood(e.target.value));

        // Clear history
        document.getElementById('clear-history').addEventListener('click', () => this.clearHistory());

        // Daily goal editing (click to edit)
        document.getElementById('daily-goal').addEventListener('click', () => this.editDailyGoal());
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionName).classList.add('active');

        if (sectionName === 'history') {
            this.updateHistory();
        }
    }

    addFood(e) {
        e.preventDefault();
        
        const foodName = document.getElementById('food-name').value;
        const calories = parseInt(document.getElementById('calories').value);
        const quantity = parseFloat(document.getElementById('quantity').value);
        const unit = document.getElementById('unit').value;

        const food = {
            id: Date.now(),
            name: foodName,
            calories: calories,
            quantity: quantity,
            unit: unit,
            totalCalories: Math.round(calories * quantity),
            date: new Date().toISOString(),
            timestamp: new Date().toLocaleTimeString()
        };

        this.foods.push(food);
        this.todaysFoods.push(food);
        this.saveData();
        this.updateDashboard();
        
        // Reset form and show success
        document.getElementById('add-food-form').reset();
        document.getElementById('quantity').value = 1;
        this.showNotification(`Added ${foodName} (${food.totalCalories} kcal)`, 'success');
        
        // Switch to dashboard to see the addition
        this.switchSection('dashboard');
    }

    searchFood(query) {
        const resultsContainer = document.getElementById('search-results');
        
        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }

        // Common foods database (simplified)
        const commonFoods = [
            { name: 'Apple', calories: 95 },
            { name: 'Banana', calories: 105 },
            { name: 'Orange', calories: 62 },
            { name: 'Chicken Breast', calories: 231 },
            { name: 'Rice (1 cup)', calories: 205 },
            { name: 'Bread Slice', calories: 79 },
            { name: 'Egg', calories: 78 },
            { name: 'Milk (1 cup)', calories: 149 },
            { name: 'Yogurt', calories: 154 },
            { name: 'Pasta (1 cup)', calories: 220 },
            { name: 'Salmon', calories: 206 },
            { name: 'Broccoli', calories: 55 },
            { name: 'Spinach', calories: 7 },
            { name: 'Almonds (1 oz)', calories: 164 },
            { name: 'Avocado', calories: 234 },
            { name: 'Sweet Potato', calories: 112 },
            { name: 'Oatmeal (1 cup)', calories: 147 },
            { name: 'Greek Yogurt', calories: 100 },
            { name: 'Pizza Slice', calories: 285 },
            { name: 'Hamburger', calories: 354 }
        ];

        const matches = commonFoods.filter(food => 
            food.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (matches.length > 0) {
            resultsContainer.innerHTML = matches.map(food => 
                `<div class="search-result" onclick="calorieTracker.selectSearchResult('${food.name}', ${food.calories})">
                    <span class="food-name">${food.name}</span>
                    <span class="food-calories">${food.calories} kcal</span>
                </div>`
            ).join('');
        } else {
            resultsContainer.innerHTML = '<div class="no-results">No foods found. Try adding manually.</div>';
        }
    }

    selectSearchResult(name, calories) {
        document.getElementById('food-name').value = name;
        document.getElementById('calories').value = calories;
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('food-search').value = '';
    }

    updateDashboard() {
        const totalCalories = this.todaysFoods.reduce((sum, food) => sum + food.totalCalories, 0);
        const remaining = Math.max(0, this.dailyGoal - totalCalories);
        const progress = Math.min(100, (totalCalories / this.dailyGoal) * 100);

        // Update stats
        document.getElementById('total-calories').textContent = totalCalories;
        document.getElementById('daily-goal').textContent = this.dailyGoal;
        document.getElementById('remaining-calories').textContent = remaining;
        document.getElementById('foods-count').textContent = this.todaysFoods.length;

        // Update progress bar
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${Math.round(progress)}% of daily goal`;

        // Update progress bar color based on progress
        const progressFill = document.getElementById('progress-fill');
        if (progress >= 100) {
            progressFill.style.backgroundColor = '#e74c3c';
        } else if (progress >= 80) {
            progressFill.style.backgroundColor = '#f39c12';
        } else {
            progressFill.style.backgroundColor = '#2ecc71';
        }

        // Update foods list
        this.updateFoodsList();
    }

    updateFoodsList() {
        const foodsList = document.getElementById('foods-list');
        
        if (this.todaysFoods.length === 0) {
            foodsList.innerHTML = '<p class="empty-state">No foods added yet. Click "Add Food" to get started!</p>';
            return;
        }

        foodsList.innerHTML = this.todaysFoods
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(food => `
                <div class="food-item">
                    <div class="food-info">
                        <h4>${food.name}</h4>
                        <p>${food.quantity} ${food.unit} • ${food.totalCalories} kcal</p>
                        <small>Added at ${food.timestamp}</small>
                    </div>
                    <button class="delete-btn" onclick="calorieTracker.deleteFood(${food.id})">×</button>
                </div>
            `).join('');
    }

    deleteFood(foodId) {
        this.foods = this.foods.filter(food => food.id !== foodId);
        this.todaysFoods = this.todaysFoods.filter(food => food.id !== foodId);
        this.saveData();
        this.updateDashboard();
        this.showNotification('Food deleted', 'info');
    }

    updateHistory() {
        const historyList = document.getElementById('history-list');
        
        if (this.foods.length === 0) {
            historyList.innerHTML = '<p class="empty-state">No history available yet.</p>';
            return;
        }

        // Group foods by date
        const foodsByDate = {};
        this.foods.forEach(food => {
            const date = new Date(food.date).toDateString();
            if (!foodsByDate[date]) {
                foodsByDate[date] = [];
            }
            foodsByDate[date].push(food);
        });

        const historyHTML = Object.entries(foodsByDate)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([date, foods]) => {
                const totalCalories = foods.reduce((sum, food) => sum + food.totalCalories, 0);
                return `
                    <div class="history-day">
                        <h3>${date} (${totalCalories} kcal total)</h3>
                        <div class="history-foods">
                            ${foods.map(food => `
                                <div class="history-food-item">
                                    <span>${food.name} - ${food.quantity} ${food.unit}</span>
                                    <span>${food.totalCalories} kcal</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');

        historyList.innerHTML = historyHTML;
    }

    editDailyGoal() {
        const currentGoal = this.dailyGoal;
        const newGoal = prompt('Enter your daily calorie goal:', currentGoal);
        
        if (newGoal && !isNaN(newGoal) && newGoal > 0) {
            this.dailyGoal = parseInt(newGoal);
            this.saveData();
            this.updateDashboard();
            this.showNotification(`Daily goal updated to ${this.dailyGoal} kcal`, 'success');
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            this.foods = [];
            this.todaysFoods = [];
            this.saveData();
            this.updateDashboard();
            this.updateHistory();
            this.showNotification('History cleared', 'info');
        }
    }

    saveData() {
        localStorage.setItem('calorieTracker_foods', JSON.stringify(this.foods));
        localStorage.setItem('calorieTracker_goal', this.dailyGoal.toString());
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the app when the page loads
let calorieTracker;
document.addEventListener('DOMContentLoaded', () => {
    calorieTracker = new CalorieTracker();
});

// Add some sample data for demo purposes
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (calorieTracker && calorieTracker.foods.length === 0) {
            // Add some sample foods for demo
            const sampleFoods = [
                { name: 'Breakfast Oatmeal', calories: 300, quantity: 1, unit: 'serving' },
                { name: 'Apple', calories: 95, quantity: 1, unit: 'piece' },
                { name: 'Chicken Salad', calories: 450, quantity: 1, unit: 'serving' }
            ];
            
            sampleFoods.forEach((food, index) => {
                setTimeout(() => {
                    const foodItem = {
                        id: Date.now() + index,
                        name: food.name,
                        calories: food.calories,
                        quantity: food.quantity,
                        unit: food.unit,
                        totalCalories: food.calories * food.quantity,
                        date: new Date().toISOString(),
                        timestamp: new Date(Date.now() - (index * 3600000)).toLocaleTimeString() // Stagger times
                    };
                    
                    calorieTracker.foods.push(foodItem);
                    calorieTracker.todaysFoods.push(foodItem);
                }, index * 100);
            });
            
            setTimeout(() => {
                calorieTracker.saveData();
                calorieTracker.updateDashboard();
            }, 500);
        }
    }, 1000);
});