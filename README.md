# Calorie Tracker Web App

A modern, responsive web application for tracking daily nutrition and calorie intake. Built with Flask, Bootstrap, and Chart.js.

## Features

### 🎯 Core Functionality
- **Add Meals**: Record food items with detailed nutritional information
- **View Meals**: Browse all recorded meals with search and filter capabilities
- **Edit Meals**: Modify existing meal entries
- **Delete Meals**: Remove meals with confirmation dialogs
- **Statistics Dashboard**: Visual overview of nutrition data

### 📊 Dashboard Features
- **Real-time Statistics**: Total calories, protein, carbs, and fats
- **Macronutrient Chart**: Interactive doughnut chart showing macro distribution
- **Recent Activity**: Latest 5 meals with quick overview
- **Daily Averages**: Average daily calorie intake
- **Quick Actions**: Easy access to common functions

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradient designs and smooth animations
- **Real-time Validation**: Automatic calorie calculation from macros
- **Quick Add Suggestions**: Pre-filled common food items
- **Search & Filter**: Find meals quickly by name or type
- **Export Functionality**: Download meal data as CSV

### 🔧 Technical Features
- **Flask Backend**: Robust Python web framework
- **CSV Storage**: Simple, portable data storage
- **RESTful API**: JSON endpoints for data access
- **Form Validation**: Client and server-side validation
- **Error Handling**: Graceful error management

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Setup Instructions

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Access the web app**:
   Open your browser and go to `http://localhost:5000`

## Usage

### Getting Started

1. **Dashboard**: The main page shows your nutrition overview
2. **Add Meal**: Click "Add New Meal" to record your first meal
3. **View Meals**: See all your recorded meals in a table format
4. **Edit/Delete**: Use the action buttons to modify or remove meals

### Adding Meals

1. Navigate to "Add New Meal"
2. Fill in the food name and nutritional values
3. Select the date and meal type
4. Use "Quick Add Suggestions" for common foods
5. The app will validate your calorie calculations

### Understanding the Dashboard

- **Total Calories**: Sum of all recorded calories
- **Macronutrients**: Protein, carbs, and fats totals
- **Macro Chart**: Visual breakdown of calorie sources
- **Recent Meals**: Your latest 5 meal entries
- **Daily Average**: Average calories per day

### Data Management

- **Search**: Use the search bar to find specific meals
- **Export**: Download your meal data as a CSV file
- **Edit**: Modify any meal entry by clicking the edit button
- **Delete**: Remove meals with a confirmation dialog

## File Structure

```
calorie-tracker/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── calories.csv          # Data storage (created automatically)
├── templates/            # HTML templates
│   ├── base.html         # Base template with navigation
│   ├── index.html        # Dashboard page
│   ├── meals.html        # Meals list page
│   ├── add_meal.html     # Add meal form
│   └── edit_meal.html    # Edit meal form
└── static/               # Static assets
    ├── css/
    │   └── style.css     # Custom styles
    └── js/
        └── app.js        # JavaScript functionality
```

## API Endpoints

The app provides RESTful API endpoints for data access:

- `GET /api/stats` - Get nutrition statistics
- `GET /api/meals` - Get all meals data
- `POST /add_meal` - Add a new meal
- `POST /edit_meal/<id>` - Edit an existing meal
- `POST /delete_meal/<id>` - Delete a meal

## Data Storage

The app uses a simple CSV file (`calories.csv`) for data storage. Each meal record contains:

- Transaction ID (unique identifier)
- Food name
- Calories
- Protein (grams)
- Carbohydrates (grams)
- Fats (grams)
- Date
- Meal type (Breakfast/Lunch/Dinner/Snack)

## Customization

### Adding New Food Suggestions

Edit the `add_meal.html` template to add more quick-add buttons:

```html
<button class="btn btn-outline-primary btn-sm w-100" 
        onclick="quickAdd('Food Name', calories, protein, carbs, fats)">
    <i class="fas fa-icon me-1"></i>Food Name
</button>
```

### Modifying Styles

Edit `static/css/style.css` to customize the appearance:

- Change color schemes by modifying CSS variables
- Adjust card layouts and spacing
- Customize button styles and animations

### Adding New Features

The modular structure makes it easy to add new features:

1. Add new routes in `app.py`
2. Create corresponding templates in `templates/`
3. Add JavaScript functionality in `static/js/app.js`
4. Style new components in `static/css/style.css`

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `app.py`:
   ```python
   app.run(debug=True, host='0.0.0.0', port=5001)
   ```

2. **Permission errors**: Ensure you have write permissions in the project directory

3. **Missing dependencies**: Run `pip install -r requirements.txt`

4. **Data not loading**: Check if `calories.csv` exists and has proper permissions

### Debug Mode

The app runs in debug mode by default. For production:

1. Set `debug=False` in `app.py`
2. Change the secret key
3. Use a production WSGI server

## Contributing

Feel free to contribute to this project by:

1. Reporting bugs
2. Suggesting new features
3. Submitting pull requests
4. Improving documentation

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the code comments
3. Create an issue in the project repository

---

**Happy tracking! 🍎💪**