// Global state and utilities
let meals = [];
let currentEditingMeal = null;

// DOM elements
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const mealForm = document.getElementById('meal-form');
const editForm = document.getElementById('edit-form');
const editModal = document.getElementById('edit-modal');
const loading = document.getElementById('loading');
const toastContainer = document.getElementById('toast-container');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setDefaultDate();
});

function initializeApp() {
    // Load initial data
    loadMeals();
    loadStatistics();
    showTab('dashboard');
}

function setupEventListeners() {
    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            showTab(tab);
            setActiveNavButton(button);
        });
    });

    // Forms
    mealForm.addEventListener('submit', handleMealSubmit);
    editForm.addEventListener('submit', handleEditSubmit);

    // Filters
    document.getElementById('filter-meal-type').addEventListener('change', filterMeals);
    document.getElementById('filter-date').addEventListener('change', filterMeals);

    // Modal
    document.querySelector('.close').addEventListener('click', closeEditModal);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editModal.style.display === 'block') {
            closeEditModal();
        }
    });
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// Navigation functions
function showTab(tabName) {
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
        
        // Load data based on tab
        if (tabName === 'meals') {
            loadMeals();
        } else if (tabName === 'statistics') {
            loadStatistics();
        } else if (tabName === 'dashboard') {
            loadDashboard();
        }
    }
}

function setActiveNavButton(activeButton) {
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// API functions
async function apiCall(url, options = {}) {
    showLoading();
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function loadMeals() {
    try {
        meals = await apiCall('/api/meals');
        displayMeals(meals);
    } catch (error) {
        console.error('Error loading meals:', error);
    }
}

async function loadStatistics() {
    try {
        const stats = await apiCall('/api/statistics');
        displayStatistics(stats);
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

async function loadDashboard() {
    try {
        const [mealsData, statsData] = await Promise.all([
            apiCall('/api/meals'),
            apiCall('/api/statistics')
        ]);
        
        meals = mealsData;
        displayDashboard(statsData, mealsData.slice(-6)); // Show last 6 meals
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Meal management functions
async function handleMealSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(mealForm);
    const mealData = {
        food_name: formData.get('food_name'),
        calories: parseFloat(formData.get('calories')),
        protein: parseFloat(formData.get('protein')),
        carbs: parseFloat(formData.get('carbs')),
        fats: parseFloat(formData.get('fats')),
        date: formData.get('date'),
        meal_type: formData.get('meal_type')
    };

    try {
        await apiCall('/api/meals', {
            method: 'POST',
            body: JSON.stringify(mealData)
        });
        
        showToast('Meal added successfully!', 'success');
        mealForm.reset();
        setDefaultDate();
        
        // Refresh data
        await loadMeals();
        if (document.getElementById('dashboard').classList.contains('active')) {
            await loadDashboard();
        }
        
    } catch (error) {
        console.error('Error adding meal:', error);
    }
}

async function editMeal(mealId) {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;

    currentEditingMeal = mealId;
    
    // Populate edit form
    document.getElementById('edit-meal-id').value = meal.id;
    document.getElementById('edit-food-name').value = meal.food_name;
    document.getElementById('edit-calories').value = meal.calories;
    document.getElementById('edit-protein').value = meal.protein;
    document.getElementById('edit-carbs').value = meal.carbs;
    document.getElementById('edit-fats').value = meal.fats;
    document.getElementById('edit-date').value = meal.date;
    document.getElementById('edit-meal-type').value = meal.meal_type;
    
    editModal.style.display = 'block';
}

async function handleEditSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(editForm);
    const mealData = {
        food_name: formData.get('food_name'),
        calories: parseFloat(formData.get('calories')),
        protein: parseFloat(formData.get('protein')),
        carbs: parseFloat(formData.get('carbs')),
        fats: parseFloat(formData.get('fats')),
        date: formData.get('date'),
        meal_type: formData.get('meal_type')
    };

    try {
        await apiCall(`/api/meals/${currentEditingMeal}`, {
            method: 'PUT',
            body: JSON.stringify(mealData)
        });
        
        showToast('Meal updated successfully!', 'success');
        closeEditModal();
        await loadMeals();
        
        if (document.getElementById('dashboard').classList.contains('active')) {
            await loadDashboard();
        }
        
    } catch (error) {
        console.error('Error updating meal:', error);
    }
}

async function deleteMeal(mealId) {
    if (!confirm('Are you sure you want to delete this meal?')) return;

    try {
        await apiCall(`/api/meals/${mealId}`, {
            method: 'DELETE'
        });
        
        showToast('Meal deleted successfully!', 'success');
        await loadMeals();
        
        if (document.getElementById('dashboard').classList.contains('active')) {
            await loadDashboard();
        }
        
    } catch (error) {
        console.error('Error deleting meal:', error);
    }
}

function closeEditModal() {
    editModal.style.display = 'none';
    currentEditingMeal = null;
}

// Display functions
function displayMeals(mealsToShow = meals) {
    const mealsList = document.getElementById('meals-list');
    
    if (mealsToShow.length === 0) {
        mealsList.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-utensils" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No meals found. Add your first meal to get started!</p>
            </div>
        `;
        return;
    }

    mealsList.innerHTML = mealsToShow.map(meal => `
        <div class="meal-card">
            <div class="meal-header">
                <h3 class="meal-name">${meal.food_name}</h3>
                <span class="meal-type">${meal.meal_type}</span>
            </div>
            <div class="meal-date">
                <i class="fas fa-calendar"></i> ${formatDate(meal.date)}
            </div>
            <div class="meal-nutrition">
                <div class="nutrition-item">
                    <span class="nutrition-label">Calories</span>
                    <span class="nutrition-value">${meal.calories}</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Protein</span>
                    <span class="nutrition-value">${meal.protein}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Carbs</span>
                    <span class="nutrition-value">${meal.carbs}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Fats</span>
                    <span class="nutrition-value">${meal.fats}g</span>
                </div>
            </div>
            <div class="meal-actions">
                <button class="btn-edit" onclick="editMeal('${meal.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteMeal('${meal.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function displayDashboard(stats, recentMeals) {
    // Update stats cards
    document.getElementById('total-calories').textContent = stats.total_calories;
    document.getElementById('total-protein').textContent = `${stats.total_protein}g`;
    document.getElementById('total-carbs').textContent = `${stats.total_carbs}g`;
    document.getElementById('total-fats').textContent = `${stats.total_fats}g`;
    
    // Display recent meals
    const recentMealsList = document.getElementById('recent-meals-list');
    
    if (recentMeals.length === 0) {
        recentMealsList.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-utensils" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No recent meals. Add your first meal to get started!</p>
            </div>
        `;
        return;
    }

    recentMealsList.innerHTML = recentMeals.map(meal => `
        <div class="meal-card">
            <div class="meal-header">
                <h3 class="meal-name">${meal.food_name}</h3>
                <span class="meal-type">${meal.meal_type}</span>
            </div>
            <div class="meal-date">
                <i class="fas fa-calendar"></i> ${formatDate(meal.date)}
            </div>
            <div class="meal-nutrition">
                <div class="nutrition-item">
                    <span class="nutrition-label">Calories</span>
                    <span class="nutrition-value">${meal.calories}</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Protein</span>
                    <span class="nutrition-value">${meal.protein}g</span>
                </div>
            </div>
        </div>
    `).join('');
}

function displayStatistics(stats) {
    const statsContent = document.getElementById('stats-content');
    
    statsContent.innerHTML = `
        <div class="stats-overview">
            <div class="stats-card">
                <h3>Total Calories</h3>
                <div class="value">${stats.total_calories}</div>
            </div>
            <div class="stats-card">
                <h3>Total Protein</h3>
                <div class="value">${stats.total_protein}g</div>
            </div>
            <div class="stats-card">
                <h3>Total Carbs</h3>
                <div class="value">${stats.total_carbs}g</div>
            </div>
            <div class="stats-card">
                <h3>Total Fats</h3>
                <div class="value">${stats.total_fats}g</div>
            </div>
            <div class="stats-card">
                <h3>Average Daily Calories</h3>
                <div class="value">${stats.average_daily_calories}</div>
            </div>
            <div class="stats-card">
                <h3>Total Meals</h3>
                <div class="value">${stats.meals_count}</div>
            </div>
        </div>
        
        <div class="daily-breakdown">
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Daily Breakdown</h3>
            <div class="breakdown-grid">
                ${Object.entries(stats.daily_breakdown || {}).map(([date, data]) => `
                    <div class="stats-card">
                        <h3>${formatDate(date)}</h3>
                        <div class="value">${data.calories} cal</div>
                        <small style="color: var(--text-secondary);">${data.count} meals</small>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Filter functions
function filterMeals() {
    const mealTypeFilter = document.getElementById('filter-meal-type').value;
    const dateFilter = document.getElementById('filter-date').value;
    
    let filteredMeals = meals;
    
    if (mealTypeFilter) {
        filteredMeals = filteredMeals.filter(meal => 
            meal.meal_type.toLowerCase().includes(mealTypeFilter.toLowerCase())
        );
    }
    
    if (dateFilter) {
        filteredMeals = filteredMeals.filter(meal => meal.date === dateFilter);
    }
    
    displayMeals(filteredMeals);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showLoading() {
    loading.style.display = 'flex';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Global functions for onclick handlers
window.editMeal = editMeal;
window.deleteMeal = deleteMeal;
window.closeEditModal = closeEditModal;