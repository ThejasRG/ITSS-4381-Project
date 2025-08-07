// Calorie Tracker Web App - Main JavaScript

// Global variables
let currentChart = null;

// Utility functions
function formatNumber(num) {
    return parseFloat(num).toFixed(1);
}

function calculateCaloriesFromMacros(protein, carbs, fats) {
    return (protein * 4) + (carbs * 4) + (fats * 9);
}

function validateMacros(calories, protein, carbs, fats) {
    const calculated = calculateCaloriesFromMacros(protein, carbs, fats);
    const difference = Math.abs(calories - calculated);
    return {
        isValid: difference <= 50,
        difference: difference,
        calculated: calculated
    };
}

// API functions
async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        return await response.json();
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}

async function fetchMeals() {
    try {
        const response = await fetch('/api/meals');
        return await response.json();
    } catch (error) {
        console.error('Error fetching meals:', error);
        return [];
    }
}

// Chart functions
function createMacroChart(ctx, data) {
    if (currentChart) {
        currentChart.destroy();
    }
    
    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Protein', 'Carbs', 'Fats'],
            datasets: [{
                data: [
                    data.protein * 4, // Protein = 4 cal/g
                    data.carbs * 4,   // Carbs = 4 cal/g
                    data.fats * 9     // Fats = 9 cal/g
                ],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#17a2b8'
                ],
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value.toFixed(0)} kcal (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
    
    return currentChart;
}

// Form validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const caloriesInput = form.querySelector('input[name="calories"]');
            const proteinInput = form.querySelector('input[name="protein"]');
            const carbsInput = form.querySelector('input[name="carbs"]');
            const fatsInput = form.querySelector('input[name="fats"]');
            
            if (caloriesInput && proteinInput && carbsInput && fatsInput) {
                const calories = parseFloat(caloriesInput.value);
                const protein = parseFloat(proteinInput.value);
                const carbs = parseFloat(carbsInput.value);
                const fats = parseFloat(fatsInput.value);
                
                const validation = validateMacros(calories, protein, carbs, fats);
                
                if (!validation.isValid) {
                    const message = `Warning: The entered calories (${calories}) don't match the calculated calories from macros (${validation.calculated.toFixed(1)}). The difference is ${validation.difference.toFixed(1)} calories. Do you want to continue?`;
                    
                    if (!confirm(message)) {
                        e.preventDefault();
                        return false;
                    }
                }
            }
        });
    });
}

// Real-time calculation updates
function setupRealTimeCalculations() {
    const inputs = ['calories', 'protein', 'carbs', 'fats'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateCalculations);
        }
    });
}

function updateCalculations() {
    const calories = parseFloat(document.getElementById('calories')?.value) || 0;
    const protein = parseFloat(document.getElementById('protein')?.value) || 0;
    const carbs = parseFloat(document.getElementById('carbs')?.value) || 0;
    const fats = parseFloat(document.getElementById('fats')?.value) || 0;
    
    if (calories > 0) {
        const proteinPercent = ((protein * 4) / calories * 100).toFixed(1);
        const carbsPercent = ((carbs * 4) / calories * 100).toFixed(1);
        const fatsPercent = ((fats * 9) / calories * 100).toFixed(1);
        
        // Update progress bars if they exist
        const proteinBar = document.querySelector('.progress-bar.bg-success');
        const carbsBar = document.querySelector('.progress-bar.bg-warning');
        const fatsBar = document.querySelector('.progress-bar.bg-info');
        
        if (proteinBar) {
            proteinBar.style.width = proteinPercent + '%';
            proteinBar.textContent = `Protein: ${proteinPercent}%`;
        }
        if (carbsBar) {
            carbsBar.style.width = carbsPercent + '%';
            carbsBar.textContent = `Carbs: ${carbsPercent}%`;
        }
        if (fatsBar) {
            fatsBar.style.width = fatsPercent + '%';
            fatsBar.textContent = `Fats: ${fatsPercent}%`;
        }
        
        // Update calculated calories display if it exists
        const calculatedDisplay = document.getElementById('calculatedCalories');
        if (calculatedDisplay) {
            const calculated = calculateCaloriesFromMacros(protein, carbs, fats);
            calculatedDisplay.textContent = calculated.toFixed(1);
            
            const difference = Math.abs(calories - calculated);
            if (difference > 50) {
                calculatedDisplay.classList.add('text-danger');
            } else {
                calculatedDisplay.classList.remove('text-danger');
            }
        }
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterMeals);
    }
}

function filterMeals() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const table = document.getElementById('mealsTable');
    
    if (!table) return;
    
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let row of rows) {
        const foodName = row.getAttribute('data-food-name') || '';
        const mealType = row.getAttribute('data-meal-type') || '';
        
        if (foodName.includes(searchTerm) || mealType.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        filterMeals();
    }
}

// Export functionality
function exportToCSV() {
    const table = document.getElementById('mealsTable');
    if (!table) return;
    
    const rows = table.getElementsByTagName('tr');
    let csv = [];
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cols = row.querySelectorAll('td, th');
        let rowData = [];
        
        for (let j = 0; j < cols.length - 1; j++) { // Exclude the Actions column
            let text = cols[j].textContent.trim();
            // Remove badge styling and extract clean text
            text = text.replace(/kcal|g/g, '').trim();
            rowData.push(`"${text}"`);
        }
        
        csv.push(rowData.join(','));
    }
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calorie_tracker_meals_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Delete confirmation
function deleteMeal(mealId, mealName) {
    const modal = document.getElementById('deleteModal');
    const mealNameSpan = document.getElementById('mealNameToDelete');
    const deleteForm = document.getElementById('deleteForm');
    
    if (modal && mealNameSpan && deleteForm) {
        mealNameSpan.textContent = mealName;
        deleteForm.action = `/delete_meal/${mealId}`;
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

// Quick add functionality
function quickAdd(foodName, calories, protein, carbs, fats) {
    const foodNameInput = document.getElementById('food_name');
    const caloriesInput = document.getElementById('calories');
    const proteinInput = document.getElementById('protein');
    const carbsInput = document.getElementById('carbs');
    const fatsInput = document.getElementById('fats');
    
    if (foodNameInput) foodNameInput.value = foodName;
    if (caloriesInput) caloriesInput.value = calories;
    if (proteinInput) proteinInput.value = protein;
    if (carbsInput) carbsInput.value = carbs;
    if (fatsInput) fatsInput.value = fats;
    
    // Trigger calculation updates
    updateCalculations();
    
    // Focus on the date field for easy editing
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.focus();
}

// Refresh stats
async function refreshStats() {
    const stats = await fetchStats();
    if (!stats) return;
    
    // Update the stats on the page
    const elements = {
        '.bg-primary .card-text': stats.total_calories,
        '.bg-success .card-text': stats.total_protein,
        '.bg-warning .card-text': stats.total_carbs,
        '.bg-info .card-text': stats.total_fats,
        '.text-primary': stats.average_daily_calories,
        '.text-success': stats.total_meals
    };
    
    Object.entries(elements).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Reinitialize charts if on dashboard
    const macroChart = document.getElementById('macroChart');
    if (macroChart) {
        const ctx = macroChart.getContext('2d');
        createMacroChart(ctx, stats);
    }
    
    // Reload recent meals if on dashboard
    loadRecentMeals();
}

// Load recent meals for dashboard
async function loadRecentMeals() {
    const recentMealsDiv = document.getElementById('recentMeals');
    if (!recentMealsDiv) return;
    
    const meals = await fetchMeals();
    
    if (meals.length === 0) {
        recentMealsDiv.innerHTML = '<p class="text-muted text-center">No meals recorded yet.</p>';
        return;
    }
    
    const recentMeals = meals.slice(-5).reverse(); // Get last 5 meals
    let html = '<div class="list-group list-group-flush">';
    
    recentMeals.forEach(meal => {
        html += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${meal.food_name}</h6>
                    <small class="text-muted">${meal.meal_type} - ${meal.date}</small>
                </div>
                <span class="badge bg-primary rounded-pill">${meal.calories} kcal</span>
            </div>
        `;
    });
    
    html += '</div>';
    recentMealsDiv.innerHTML = html;
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calorie Tracker Web App initialized');
    
    // Setup form validation
    setupFormValidation();
    
    // Setup real-time calculations
    setupRealTimeCalculations();
    
    // Setup search functionality
    setupSearch();
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
});

// Global functions for use in templates
window.calculateCaloriesFromMacros = calculateCaloriesFromMacros;
window.validateMacros = validateMacros;
window.refreshStats = refreshStats;
window.clearSearch = clearSearch;
window.exportToCSV = exportToCSV;
window.deleteMeal = deleteMeal;
window.quickAdd = quickAdd;
window.updateCalculations = updateCalculations;