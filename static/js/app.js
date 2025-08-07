// Calorie Tracker Web App - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        var alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);

    // Add loading states to forms
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function() {
            var submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';
                submitBtn.disabled = true;
            }
        });
    });

    // Enhanced form validation
    function validateNutritionForm() {
        var calories = parseFloat(document.getElementById('calories')?.value) || 0;
        var protein = parseFloat(document.getElementById('protein')?.value) || 0;
        var carbs = parseFloat(document.getElementById('carbs')?.value) || 0;
        var fats = parseFloat(document.getElementById('fats')?.value) || 0;

        var isValid = true;
        var messages = [];

        // Check for negative values
        if (calories < 0 || protein < 0 || carbs < 0 || fats < 0) {
            messages.push('All nutritional values must be positive numbers.');
            isValid = false;
        }

        // Check for reasonable calorie values
        if (calories > 5000) {
            messages.push('Calorie value seems unusually high. Please verify.');
        }

        // Check macro consistency
        var calculatedCalories = (protein * 4) + (carbs * 4) + (fats * 9);
        var difference = Math.abs(calories - calculatedCalories);
        
        if (calories > 0 && calculatedCalories > 0 && difference > 50) {
            messages.push('The calorie value doesn\'t match the calculated calories from macros. Please verify your values.');
        }

        return { isValid, messages };
    }

    // Add validation to nutrition forms
    var nutritionForms = document.querySelectorAll('#addMealForm, #modifyMealForm');
    nutritionForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            var validation = validateNutritionForm();
            if (!validation.isValid) {
                e.preventDefault();
                alert('Validation Error:\n' + validation.messages.join('\n'));
                return false;
            }
        });
    });

    // Enhanced search functionality
    function setupSearch() {
        var searchInput = document.getElementById('searchInput');
        if (searchInput) {
            var searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(function() {
                    performSearch(searchInput.value);
                }, 300);
            });
        }
    }

    function performSearch(searchTerm) {
        var table = document.getElementById('mealsTable');
        if (!table) return;

        var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        var visibleCount = 0;

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var text = row.textContent.toLowerCase();
            var isVisible = text.includes(searchTerm.toLowerCase());
            
            row.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount++;
        }

        // Update search results count
        var resultsCount = document.getElementById('searchResultsCount');
        if (resultsCount) {
            resultsCount.textContent = visibleCount + ' result' + (visibleCount !== 1 ? 's' : '');
        }
    }

    // Initialize search
    setupSearch();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N for new meal
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            var addMealLink = document.querySelector('a[href*="add_meal"]');
            if (addMealLink) {
                window.location.href = addMealLink.href;
            }
        }

        // Ctrl/Cmd + S for save (on forms)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            var activeForm = document.querySelector('form:focus-within');
            if (activeForm) {
                e.preventDefault();
                activeForm.submit();
            }
        }

        // Escape key to clear search
        if (e.key === 'Escape') {
            var searchInput = document.getElementById('searchInput');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.value = '';
                performSearch('');
                searchInput.blur();
            }
        }
    });

    // Add confirmation for delete actions
    var deleteLinks = document.querySelectorAll('a[href*="delete_meal"]');
    deleteLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this meal? This action cannot be undone.')) {
                e.preventDefault();
                return false;
            }
        });
    });

    // Add copy to clipboard functionality
    function addCopyFunctionality() {
        var mealRows = document.querySelectorAll('#mealsTable tbody tr');
        mealRows.forEach(function(row) {
            row.addEventListener('dblclick', function() {
                var mealData = [];
                var cells = row.querySelectorAll('td');
                cells.forEach(function(cell, index) {
                    if (index < 7) { // Exclude actions column
                        mealData.push(cell.textContent.trim());
                    }
                });
                
                var mealText = mealData.join(' | ');
                navigator.clipboard.writeText(mealText).then(function() {
                    showToast('Meal data copied to clipboard!', 'success');
                }).catch(function() {
                    showToast('Failed to copy to clipboard', 'error');
                });
            });
        });
    }

    // Toast notification system
    function showToast(message, type = 'info') {
        var toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '1055';
            document.body.appendChild(toastContainer);
        }

        var toastId = 'toast-' + Date.now();
        var toastHtml = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Calorie Tracker</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        var toastElement = document.getElementById(toastId);
        var toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Auto-remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    }

    // Initialize copy functionality
    addCopyFunctionality();

    // Add data export functionality
    function exportData(format = 'csv') {
        var table = document.getElementById('mealsTable');
        if (!table) return;

        var rows = table.querySelectorAll('tbody tr');
        var data = [];
        
        // Add header
        data.push(['ID', 'Food Name', 'Calories', 'Protein', 'Carbs', 'Fats', 'Date', 'Meal Type']);

        // Add data rows
        rows.forEach(function(row) {
            if (row.style.display !== 'none') {
                var rowData = [];
                var cells = row.querySelectorAll('td');
                cells.forEach(function(cell, index) {
                    if (index < 8) { // Exclude actions column
                        rowData.push(cell.textContent.trim().replace(' kcal', '').replace('g', ''));
                    }
                });
                data.push(rowData);
            }
        });

        if (format === 'csv') {
            var csvContent = data.map(row => row.join(',')).join('\n');
            var blob = new Blob([csvContent], { type: 'text/csv' });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'calorie_tracker_data.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }

    // Add export button if on meals page
    var mealsTable = document.getElementById('mealsTable');
    if (mealsTable) {
        var exportBtn = document.createElement('button');
        exportBtn.className = 'btn btn-outline-success btn-sm ms-2';
        exportBtn.innerHTML = '<i class="fas fa-download me-1"></i>Export CSV';
        exportBtn.onclick = function() {
            exportData('csv');
            showToast('Data exported successfully!', 'success');
        };

        var tableHeader = mealsTable.parentElement.querySelector('.card-header');
        if (tableHeader) {
            tableHeader.appendChild(exportBtn);
        }
    }

    // Add responsive table enhancements
    function enhanceTableResponsiveness() {
        var tables = document.querySelectorAll('.table-responsive');
        tables.forEach(function(table) {
            var wrapper = table.parentElement;
            if (wrapper && wrapper.classList.contains('card-body')) {
                wrapper.style.overflowX = 'auto';
            }
        });
    }

    enhanceTableResponsiveness();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize any additional features
    console.log('Calorie Tracker Web App initialized successfully!');
});