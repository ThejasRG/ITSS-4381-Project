// SnackShack Calorie Tracker - JavaScript Functionality

// Food Database with common foods and their calories per 100g
const foodDatabase = [
    // Fruits
    { name: "Apple", calories: 52, category: "fruit" },
    { name: "Banana", calories: 89, category: "fruit" },
    { name: "Orange", calories: 47, category: "fruit" },
    { name: "Strawberries", calories: 32, category: "fruit" },
    { name: "Grapes", calories: 62, category: "fruit" },
    { name: "Pineapple", calories: 50, category: "fruit" },
    { name: "Mango", calories: 60, category: "fruit" },
    { name: "Blueberries", calories: 57, category: "fruit" },
    
    // Vegetables
    { name: "Broccoli", calories: 34, category: "vegetable" },
    { name: "Carrot", calories: 41, category: "vegetable" },
    { name: "Spinach", calories: 23, category: "vegetable" },
    { name: "Tomato", calories: 18, category: "vegetable" },
    { name: "Cucumber", calories: 16, category: "vegetable" },
    { name: "Bell Pepper", calories: 31, category: "vegetable" },
    { name: "Lettuce", calories: 15, category: "vegetable" },
    { name: "Onion", calories: 40, category: "vegetable" },
    
    // Proteins
    { name: "Chicken Breast", calories: 165, category: "protein" },
    { name: "Salmon", calories: 208, category: "protein" },
    { name: "Eggs", calories: 155, category: "protein" },
    { name: "Tuna", calories: 144, category: "protein" },
    { name: "Ground Beef", calories: 250, category: "protein" },
    { name: "Tofu", calories: 76, category: "protein" },
    { name: "Greek Yogurt", calories: 59, category: "protein" },
    { name: "Cottage Cheese", calories: 98, category: "protein" },
    
    // Grains & Carbs
    { name: "White Rice", calories: 130, category: "grain" },
    { name: "Brown Rice", calories: 111, category: "grain" },
    { name: "Pasta", calories: 131, category: "grain" },
    { name: "Bread", calories: 265, category: "grain" },
    { name: "Oats", calories: 389, category: "grain" },
    { name: "Quinoa", calories: 120, category: "grain" },
    { name: "Sweet Potato", calories: 86, category: "grain" },
    { name: "Potato", calories: 77, category: "grain" },
    
    // Snacks & Others
    { name: "Almonds", calories: 579, category: "snack" },
    { name: "Peanut Butter", calories: 588, category: "snack" },
    { name: "Chocolate", calories: 546, category: "snack" },
    { name: "Chips", calories: 536, category: "snack" },
    { name: "Ice Cream", calories: 207, category: "snack" },
    { name: "Pizza", calories: 266, category: "snack" },
    { name: "Burger", calories: 295, category: "snack" },
    { name: "French Fries", calories: 365, category: "snack" }
];

// Application State
let dailyCalories = 0;
let mealCounts = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
let mealTotals = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
let selectedFood = null;
let currentStreak = 1;

// DOM Elements
const elements = {
    currentDate: document.getElementById('current-date'),
    currentCalories: document.getElementById('current-calories'),
    caloriesProgress: document.getElementById('calories-progress'),
    mealsCount: document.getElementById('meals-count'),
    streakCount: document.getElementById('streak-count'),
    foodSearch: document.getElementById('food-search'),
    searchResults: document.getElementById('search-results'),
    servingSize: document.getElementById('serving-size'),
    mealType: document.getElementById('meal-type'),
    caloriesPreview: document.getElementById('calories-preview'),
    previewFood: document.getElementById('preview-food'),
    previewCalories: document.getElementById('preview-calories'),
    addBtn: document.getElementById('add-btn'),
    addFoodForm: document.getElementById('add-food-form'),
    clearLogBtn: document.getElementById('clear-log-btn')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateDisplay();
});

function initializeApp() {
    // Set current date
    const now = new Date();
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    elements.currentDate.textContent = now.toLocaleDateString('en-US', dateOptions);
    
    // Load saved data from localStorage
    loadSavedData();
}

function setupEventListeners() {
    // Food search functionality
    elements.foodSearch.addEventListener('input', handleFoodSearch);
    elements.foodSearch.addEventListener('focus', showSearchResults);
    elements.foodSearch.addEventListener('blur', hideSearchResults);
    
    // Serving size change
    elements.servingSize.addEventListener('input', updateCaloriesPreview);
    
    // Form submission
    elements.addFoodForm.addEventListener('submit', handleAddFood);
    
    // Clear log
    elements.clearLogBtn.addEventListener('click', clearDailyLog);
    
    // Click outside search results to close
    document.addEventListener('click', function(e) {
        if (!elements.foodSearch.contains(e.target) && !elements.searchResults.contains(e.target)) {
            hideSearchResults();
        }
    });
}

function handleFoodSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length === 0) {
        elements.searchResults.style.display = 'none';
        selectedFood = null;
        updateCaloriesPreview();
        return;
    }
    
    // Filter foods based on query
    const filteredFoods = foodDatabase.filter(food => 
        food.name.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 results
    
    displaySearchResults(filteredFoods);
}

function displaySearchResults(foods) {
    if (foods.length === 0) {
        elements.searchResults.style.display = 'none';
        return;
    }
    
    const resultsHTML = foods.map(food => `
        <div class="search-result-item" onclick="selectFood('${food.name}', ${food.calories})">
            <div class="result-name">${food.name}</div>
            <div class="result-calories">${food.calories} cal per 100g</div>
        </div>
    `).join('');
    
    elements.searchResults.innerHTML = resultsHTML;
    elements.searchResults.style.display = 'block';
}

function selectFood(name, calories) {
    selectedFood = { name, calories };
    elements.foodSearch.value = name;
    elements.searchResults.style.display = 'none';
    updateCaloriesPreview();
    elements.addBtn.disabled = false;
}

function updateCaloriesPreview() {
    if (!selectedFood) {
        elements.caloriesPreview.style.display = 'none';
        elements.addBtn.disabled = true;
        return;
    }
    
    const servingSize = parseFloat(elements.servingSize.value) || 1;
    const totalCalories = Math.round((selectedFood.calories * servingSize) / 100 * 100); // per 100g serving
    
    elements.previewFood.textContent = `${servingSize * 100}g ${selectedFood.name}`;
    elements.previewCalories.textContent = totalCalories;
    elements.caloriesPreview.style.display = 'block';
    elements.addBtn.disabled = false;
}

function handleAddFood(e) {
    e.preventDefault();
    
    if (!selectedFood) {
        showNotification('Please select a food item', 'error');
        return;
    }
    
    const servingSize = parseFloat(elements.servingSize.value) || 1;
    const mealType = elements.mealType.value;
    const totalCalories = Math.round((selectedFood.calories * servingSize) / 100 * 100);
    
    // Add food to meal
    addFoodToMeal(selectedFood.name, totalCalories, servingSize, mealType);
    
    // Reset form
    resetForm();
    
    // Update display
    updateDisplay();
    
    // Show success notification
    showNotification(`Added ${selectedFood.name} to ${mealType}!`, 'success');
}

function addFoodToMeal(foodName, calories, serving, mealType) {
    const mealItems = document.getElementById(`${mealType}-items`);
    const emptyMeal = mealItems.querySelector('.empty-meal');
    
    if (emptyMeal) {
        emptyMeal.remove();
    }
    
    // Create food item element
    const foodItem = document.createElement('div');
    foodItem.className = 'food-item';
    foodItem.innerHTML = `
        <div class="food-info">
            <div class="food-name">${foodName}</div>
            <div class="food-details">${serving * 100}g serving</div>
        </div>
        <div class="food-calories">${calories} cal</div>
        <button class="remove-btn" onclick="removeFoodItem(this, ${calories}, '${mealType}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    mealItems.appendChild(foodItem);
    
    // Update totals
    dailyCalories += calories;
    mealTotals[mealType] += calories;
    mealCounts[mealType]++;
    
    // Save to localStorage
    saveData();
}

function removeFoodItem(button, calories, mealType) {
    const foodItem = button.parentElement;
    const mealItems = foodItem.parentElement;
    
    // Remove from DOM
    foodItem.remove();
    
    // Update totals
    dailyCalories -= calories;
    mealTotals[mealType] -= calories;
    mealCounts[mealType]--;
    
    // Show empty message if no items left
    if (mealItems.children.length === 0) {
        mealItems.innerHTML = '<div class="empty-meal">No items logged</div>';
    }
    
    // Update display
    updateDisplay();
    
    // Save to localStorage
    saveData();
    
    showNotification('Food item removed', 'info');
}

function updateDisplay() {
    // Update calories display
    elements.currentCalories.textContent = dailyCalories;
    
    // Update progress bar
    const progressPercentage = Math.min((dailyCalories / 2000) * 100, 100);
    elements.caloriesProgress.style.width = `${progressPercentage}%`;
    
    // Update meals count
    const totalMeals = Object.values(mealCounts).reduce((sum, count) => sum + count, 0);
    elements.mealsCount.textContent = totalMeals;
    
    // Update streak
    elements.streakCount.textContent = currentStreak;
    
    // Update meal totals
    Object.keys(mealTotals).forEach(mealType => {
        const totalElement = document.getElementById(`${mealType}-total`);
        if (totalElement) {
            totalElement.textContent = mealTotals[mealType];
        }
    });
}

function resetForm() {
    elements.foodSearch.value = '';
    elements.servingSize.value = '1';
    elements.mealType.value = 'breakfast';
    elements.caloriesPreview.style.display = 'none';
    elements.addBtn.disabled = true;
    selectedFood = null;
}

function clearDailyLog() {
    if (confirm('Are you sure you want to clear all logged foods for today?')) {
        // Clear all meal items
        ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
            const mealItems = document.getElementById(`${mealType}-items`);
            mealItems.innerHTML = '<div class="empty-meal">No items logged</div>';
        });
        
        // Reset totals
        dailyCalories = 0;
        mealCounts = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
        mealTotals = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
        
        // Update display
        updateDisplay();
        
        // Save to localStorage
        saveData();
        
        showNotification('Daily log cleared', 'info');
    }
}

function showSearchResults() {
    if (elements.searchResults.children.length > 0) {
        elements.searchResults.style.display = 'block';
    }
}

function hideSearchResults() {
    setTimeout(() => {
        elements.searchResults.style.display = 'none';
    }, 150);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        color: #2E5B8A;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(74, 144, 226, 0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function saveData() {
    const data = {
        dailyCalories,
        mealCounts,
        mealTotals,
        currentStreak,
        date: new Date().toDateString(),
        mealItems: {}
    };
    
    // Save meal items HTML
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
        const mealItems = document.getElementById(`${mealType}-items`);
        data.mealItems[mealType] = mealItems.innerHTML;
    });
    
    localStorage.setItem('snackshack-data', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('snackshack-data');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        const today = new Date().toDateString();
        
        // Only load data if it's from today
        if (data.date === today) {
            dailyCalories = data.dailyCalories || 0;
            mealCounts = data.mealCounts || { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
            mealTotals = data.mealTotals || { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
            currentStreak = data.currentStreak || 1;
            
            // Restore meal items
            if (data.mealItems) {
                Object.keys(data.mealItems).forEach(mealType => {
                    const mealItems = document.getElementById(`${mealType}-items`);
                    if (mealItems) {
                        mealItems.innerHTML = data.mealItems[mealType];
                    }
                });
            }
        }
    }
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);