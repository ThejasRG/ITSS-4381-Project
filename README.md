# Calorie Tracker Web App

A modern, responsive web application for tracking daily nutrition and calorie intake. Built with Flask, Bootstrap, and Chart.js.

## Features

### 🍎 Core Functionality
- **Add Meals**: Log food items with detailed nutritional information
- **View Meals**: Browse and search through your meal history
- **Edit Meals**: Modify existing meal entries
- **Delete Meals**: Remove unwanted entries
- **Statistics**: Comprehensive nutrition analytics and charts

### 📊 Analytics & Insights
- **Dashboard Overview**: Quick summary of your nutrition data
- **Macro Distribution**: Visual breakdown of protein, carbs, and fats
- **Daily Trends**: Track calorie intake over time
- **Nutrition Goals**: Progress tracking against example goals
- **Export Data**: Download your meal data as CSV

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradient design with smooth animations
- **Real-time Validation**: Instant feedback on nutrition calculations
- **Keyboard Shortcuts**: Quick navigation and actions
- **Search & Filter**: Find meals by type, date, or keywords

## Screenshots

### Dashboard
- Overview cards showing total calories, protein, carbs, and fats
- Quick action buttons for common tasks
- Recent meals table with edit/delete options
- Macro breakdown progress bars

### Add/Edit Meals
- Clean form with validation
- Real-time nutrition calculation feedback
- Date picker with today's date as default
- Meal type selection (Breakfast, Lunch, Dinner, Snack)

### View Meals
- Sortable table with all meal data
- Advanced filtering by meal type and date
- Search functionality
- Export to CSV option

### Statistics
- Interactive charts using Chart.js
- Daily calorie trends
- Macro distribution pie chart
- Goal progress tracking

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Quick Start

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

### File Structure
```
calorie-tracker/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── calories.csv          # Data storage (created automatically)
├── templates/            # HTML templates
│   ├── base.html         # Base template with navigation
│   ├── index.html        # Dashboard page
│   ├── add_meal.html     # Add meal form
│   ├── view_meals.html   # View meals table
│   ├── modify_meal.html  # Edit meal form
│   └── statistics.html   # Statistics and charts
└── static/               # Static assets
    ├── css/
    │   └── style.css     # Custom styles
    └── js/
        └── app.js        # JavaScript functionality
```

## Usage Guide

### Adding Your First Meal
1. Click "Add New Meal" from the dashboard
2. Fill in the food name and select meal type
3. Enter nutritional values (calories, protein, carbs, fats)
4. Choose the date (defaults to today)
5. Click "Save Meal"

### Viewing and Managing Meals
- **View All**: Click "View Meals" to see your complete history
- **Filter**: Use the filter options to find specific meals
- **Search**: Type in the search box to find meals by name
- **Edit**: Click the edit icon (pencil) next to any meal
- **Delete**: Click the trash icon to remove a meal

### Understanding Statistics
- **Macro Distribution**: Shows the percentage breakdown of calories from protein, carbs, and fats
- **Daily Trends**: Visual representation of your calorie intake over time
- **Goals**: Example nutrition goals based on a 2000-calorie diet

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Add new meal
- `Ctrl/Cmd + S`: Save form (when focused on a form)
- `Escape`: Clear search (when search is active)

## Data Storage

The application stores all meal data in a local CSV file (`calories.csv`). The data structure includes:
- Unique meal ID
- Food name
- Calories (kcal)
- Protein (g)
- Carbohydrates (g)
- Fats (g)
- Date
- Meal type

## Customization

### Changing Goals
Edit the nutrition goals in `templates/statistics.html`:
- Daily calorie goal (currently 2000 kcal)
- Protein goal (currently 50g/day)
- Carbs goal (currently 250g/day)
- Fats goal (currently 65g/day)

### Styling
Modify `static/css/style.css` to customize:
- Color scheme
- Typography
- Layout spacing
- Animations

### Adding Features
The modular structure makes it easy to add new features:
- New routes in `app.py`
- Additional templates in `templates/`
- Enhanced functionality in `static/js/app.js`

## Technical Details

### Backend (Flask)
- **Framework**: Flask 2.3.3
- **Template Engine**: Jinja2
- **Data Storage**: CSV file (can be easily migrated to database)
- **Validation**: Server-side form validation

### Frontend
- **CSS Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.0.0
- **Charts**: Chart.js
- **JavaScript**: Vanilla JS with modern ES6+ features

### Features
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript
- **Accessibility**: ARIA labels and semantic HTML
- **Performance**: Optimized loading and minimal dependencies

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change the port in app.py
app.run(debug=True, host='0.0.0.0', port=5001)
```

**Permission errors with CSV file**
```bash
# Ensure write permissions in the project directory
chmod 755 .
```

**Dependencies not found**
```bash
# Reinstall requirements
pip install --upgrade -r requirements.txt
```

### Data Backup
To backup your meal data, simply copy the `calories.csv` file. To restore, replace the existing file with your backup.

## Contributing

Feel free to enhance this application by:
1. Adding new features
2. Improving the UI/UX
3. Adding database support
4. Implementing user authentication
5. Adding meal suggestions or food database integration

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments for implementation details
3. Create an issue with detailed error information

---

**Happy Tracking! 🍎📊**