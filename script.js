// SnackStack - JavaScript Application Logic
// Group 10 - ITSS 4381.5u1

class SnackStack {
    constructor() {
        this.snacks = this.loadData();
        this.goals = {
            calories: 2000,
            protein: 150,
            carbs: 250,
            fats: 67
        };
        this.snakeSegments = [];
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.updateDisplay();
        this.drawSnake();
    }

    setupCanvas() {
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Make canvas responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.offsetWidth;
        const maxWidth = 800;
        const width = Math.min(containerWidth - 40, maxWidth);
        const height = Math.floor(width * 0.375); // 8:3 aspect ratio
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        this.drawSnake();
    }

    setupEventListeners() {
        // Quick add form
        document.getElementById('quickAddForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addQuickSnack();
        });

        // Custom add form
        document.getElementById('customAddForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCustomSnack();
        });

        // Clear data button
        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });
    }

    addQuickSnack() {
        const select = document.getElementById('snackSelect');
        const selectedValue = select.value;
        
        if (!selectedValue) {
            this.showNotification('Please select a snack!', 'error');
            return;
        }

        const snackData = this.getQuickSnackData(selectedValue);
        this.addSnack(snackData);
        select.value = '';
    }

    addCustomSnack() {
        const name = document.getElementById('customName').value.trim();
        const calories = parseFloat(document.getElementById('customCalories').value) || 0;
        const protein = parseFloat(document.getElementById('customProtein').value) || 0;
        const carbs = parseFloat(document.getElementById('customCarbs').value) || 0;
        const fats = parseFloat(document.getElementById('customFats').value) || 0;

        if (!name || calories <= 0) {
            this.showNotification('Please enter a valid snack name and calories!', 'error');
            return;
        }

        const snackData = {
            name: name,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fats: fats,
            emoji: '🍽️'
        };

        this.addSnack(snackData);
        
        // Clear form
        document.getElementById('customAddForm').reset();
    }

    getQuickSnackData(snackType) {
        const snackDatabase = {
            apple: { name: 'Apple', calories: 80, protein: 0.5, carbs: 21, fats: 0.2, emoji: '🍎' },
            banana: { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, emoji: '🍌' },
            almonds: { name: 'Almonds (1oz)', calories: 160, protein: 6, carbs: 6, fats: 14, emoji: '🥜' },
            yogurt: { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fats: 0, emoji: '🥛' },
            carrots: { name: 'Baby Carrots', calories: 35, protein: 1, carbs: 8, fats: 0.2, emoji: '🥕' },
            granola: { name: 'Granola Bar', calories: 140, protein: 3, carbs: 22, fats: 5, emoji: '🥣' }
        };

        return snackDatabase[snackType];
    }

    addSnack(snackData) {
        const snack = {
            id: Date.now(),
            name: snackData.name,
            calories: snackData.calories,
            protein: snackData.protein,
            carbs: snackData.carbs,
            fats: snackData.fats,
            emoji: snackData.emoji,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };

        this.snacks.push(snack);
        this.saveData();
        this.updateDisplay();
        this.animateSnakeGrowth();
        this.showNotification(`${snackData.emoji} ${snackData.name} added successfully!`, 'success');
    }

    updateDisplay() {
        this.updateProgressBars();
        this.updateSnacksList();
        this.updateStats();
    }

    updateProgressBars() {
        const totals = this.calculateTotals();
        
        // Update calories
        const caloriesPercent = Math.min((totals.calories / this.goals.calories) * 100, 100);
        document.getElementById('caloriesFill').style.width = caloriesPercent + '%';
        document.getElementById('caloriesProgress').textContent = `${Math.round(totals.calories)} / ${this.goals.calories}`;

        // Update protein
        const proteinPercent = Math.min((totals.protein / this.goals.protein) * 100, 100);
        document.getElementById('proteinFill').style.width = proteinPercent + '%';
        document.getElementById('proteinProgress').textContent = `${Math.round(totals.protein)}g / ${this.goals.protein}g`;

        // Update carbs
        const carbsPercent = Math.min((totals.carbs / this.goals.carbs) * 100, 100);
        document.getElementById('carbsFill').style.width = carbsPercent + '%';
        document.getElementById('carbsProgress').textContent = `${Math.round(totals.carbs)}g / ${this.goals.carbs}g`;

        // Update fats
        const fatsPercent = Math.min((totals.fats / this.goals.fats) * 100, 100);
        document.getElementById('fatsFill').style.width = fatsPercent + '%';
        document.getElementById('fatsProgress').textContent = `${Math.round(totals.fats)}g / ${this.goals.fats}g`;

        // Update overall goal percentage
        const overallPercent = Math.round((caloriesPercent + proteinPercent + carbsPercent + fatsPercent) / 4);
        document.getElementById('goalPercentage').textContent = overallPercent + '%';
    }

    updateSnacksList() {
        const snacksList = document.getElementById('snacksList');
        
        if (this.snacks.length === 0) {
            snacksList.innerHTML = `
                <div class="empty-state">
                    <p>No snacks logged yet today.</p>
                    <p>Add your first snack to start growing your snake! 🐍</p>
                </div>
            `;
            return;
        }

        const snacksHTML = this.snacks
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(snack => `
                <div class="snack-item">
                    <div class="snack-info">
                        <h4>${snack.emoji} ${snack.name}</h4>
                        <div class="snack-nutrition">
                            ${Math.round(snack.calories)} cal • 
                            ${Math.round(snack.protein)}g protein • 
                            ${Math.round(snack.carbs)}g carbs • 
                            ${Math.round(snack.fats)}g fats
                        </div>
                    </div>
                    <div class="snack-time">${snack.time}</div>
                </div>
            `).join('');

        snacksList.innerHTML = snacksHTML;
    }

    updateStats() {
        const snakeLength = Math.max(1, Math.floor(this.snacks.length / 2) + 1);
        const nutritionScore = this.calculateNutritionScore();
        
        document.getElementById('snakeLength').textContent = snakeLength;
        document.getElementById('nutritionScore').textContent = nutritionScore;
        
        this.drawSnake();
    }

    calculateTotals() {
        return this.snacks.reduce((totals, snack) => {
            totals.calories += snack.calories;
            totals.protein += snack.protein;
            totals.carbs += snack.carbs;
            totals.fats += snack.fats;
            return totals;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
    }

    calculateNutritionScore() {
        if (this.snacks.length === 0) return 0;
        
        const totals = this.calculateTotals();
        const scores = [
            Math.min(totals.calories / this.goals.calories, 1),
            Math.min(totals.protein / this.goals.protein, 1),
            Math.min(totals.carbs / this.goals.carbs, 1),
            Math.min(totals.fats / this.goals.fats, 1)
        ];
        
        return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length * 100);
    }

    drawSnake() {
        if (!this.ctx) return;
        
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate snake length based on snacks
        const baseLength = 3;
        const snakeLength = Math.max(baseLength, Math.floor(this.snacks.length / 2) + baseLength);
        const segmentSize = Math.min(25, canvas.width / (snakeLength + 5));
        
        // Snake path (sinusoidal)
        const centerY = canvas.height / 2;
        const amplitude = canvas.height * 0.15;
        const frequency = 0.02;
        
        // Generate snake segments
        this.snakeSegments = [];
        for (let i = 0; i < snakeLength; i++) {
            const x = (canvas.width / (snakeLength + 1)) * (i + 1);
            const y = centerY + Math.sin(x * frequency) * amplitude;
            
            this.snakeSegments.push({ x, y, size: segmentSize });
        }
        
        // Draw snake body
        for (let i = snakeLength - 1; i >= 0; i--) {
            const segment = this.snakeSegments[i];
            const isHead = i === 0;
            
            // Segment color based on nutrition balance
            let color;
            if (isHead) {
                color = '#10b981'; // Green head
            } else {
                const nutritionScore = this.calculateNutritionScore();
                if (nutritionScore > 75) {
                    color = '#10b981'; // Green for good nutrition
                } else if (nutritionScore > 50) {
                    color = '#f59e0b'; // Yellow for okay nutrition
                } else {
                    color = '#ef4444'; // Red for poor nutrition
                }
            }
            
            // Draw segment shadow
            ctx.beginPath();
            ctx.arc(segment.x + 2, segment.y + 2, segment.size / 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fill();
            
            // Draw segment
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, segment.size / 2, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            
            // Add shine effect
            ctx.beginPath();
            ctx.arc(segment.x - segment.size / 6, segment.y - segment.size / 6, segment.size / 6, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            
            // Draw head features
            if (isHead) {
                // Eyes
                ctx.beginPath();
                ctx.arc(segment.x - segment.size / 4, segment.y - segment.size / 6, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(segment.x + segment.size / 4, segment.y - segment.size / 6, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.fill();
                
                // Pupils
                ctx.beginPath();
                ctx.arc(segment.x - segment.size / 4, segment.y - segment.size / 6, 1.5, 0, 2 * Math.PI);
                ctx.fillStyle = 'black';
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(segment.x + segment.size / 4, segment.y - segment.size / 6, 1.5, 0, 2 * Math.PI);
                ctx.fillStyle = 'black';
                ctx.fill();
            }
        }
        
        // Draw food items (representing recent snacks)
        const recentSnacks = this.snacks.slice(-3);
        recentSnacks.forEach((snack, index) => {
            const x = canvas.width - 50 - (index * 40);
            const y = 30;
            
            ctx.font = '20px Arial';
            ctx.fillText(snack.emoji, x, y);
        });
    }

    animateSnakeGrowth() {
        // Simple growth animation
        let scale = 0.8;
        const animate = () => {
            scale += 0.05;
            if (scale <= 1.1) {
                this.ctx.save();
                this.ctx.scale(scale, scale);
                this.drawSnake();
                this.ctx.restore();
                requestAnimationFrame(animate);
            } else {
                this.drawSnake();
            }
        };
        animate();
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? 'linear-gradient(45deg, #10b981, #059669)' : 'linear-gradient(45deg, #ef4444, #dc2626)'};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 300);
        }, 3000);
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            this.snacks = [];
            this.saveData();
            this.updateDisplay();
            this.showNotification('All data cleared successfully!', 'success');
        }
    }

    saveData() {
        try {
            localStorage.setItem('snackstack_data', JSON.stringify({
                snacks: this.snacks,
                lastUpdated: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    loadData() {
        try {
            const data = localStorage.getItem('snackstack_data');
            if (data) {
                const parsed = JSON.parse(data);
                // Only load data from today
                const today = new Date().toDateString();
                return parsed.snacks.filter(snack => 
                    new Date(snack.timestamp).toDateString() === today
                );
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
        return [];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SnackStack();
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    if (e.code === 'ArrowUp') {
        console.log('🐍 SnackStack by Group 10 - Keep growing your snake!');
    }
});