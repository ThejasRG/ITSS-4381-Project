# Calorie Tracker Web App

A modern, responsive web application for tracking daily nutrition intake, converted from a command-line Python notebook to a full-featured web app.

## Features

- **📊 Dashboard**: Overview of your nutrition stats and recent meals
- **➕ Add Meals**: Easy form to log food with calories, protein, carbs, and fats
- **📋 View Meals**: Browse all logged meals with filtering options
- **📈 Statistics**: Comprehensive nutrition analytics and daily breakdowns
- **✏️ Edit/Delete**: Modify or remove existing meal entries
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Beautiful, intuitive interface with smooth animations

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data Storage**: CSV files
- **Icons**: Font Awesome
- **Styling**: Modern CSS with CSS Grid and Flexbox

## Quick Start

### Prerequisites

- Python 3.7+
- pip (Python package installer)

### Installation

1. **Clone or download the project**:
   ```bash
   git clone <repository-url>
   cd calorie-tracker-webapp
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
calorie-tracker-webapp/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── style.css         # CSS styling
│   └── script.js         # JavaScript functionality
└── calories.csv          # Data storage (created automatically)
```

## API Endpoints

The application provides a RESTful API:

- `GET /` - Serve the main web application
- `GET /api/meals` - Retrieve all meals
- `POST /api/meals` - Add a new meal
- `PUT /api/meals/<id>` - Update an existing meal
- `DELETE /api/meals/<id>` - Delete a meal
- `GET /api/statistics` - Get nutrition statistics

## Usage

### Adding a Meal

1. Click the "Add Meal" tab
2. Fill in the meal details:
   - Food name
   - Calories
   - Protein (grams)
   - Carbohydrates (grams)
   - Fats (grams)
   - Date
   - Meal type (Breakfast, Lunch, Dinner, Snack)
3. Click "Save Meal"

### Viewing Meals

1. Click the "View Meals" tab
2. Use filters to narrow down results:
   - Filter by meal type
   - Filter by specific date
3. Edit or delete meals using the action buttons

### Dashboard Overview

The dashboard shows:
- Total nutrition summaries
- Recent meals (last 6 entries)
- Quick statistics overview

### Statistics

View comprehensive analytics including:
- Total and average nutrition values
- Daily breakdown of calories and meal counts
- Overall nutrition trends

## Data Storage

Meal data is stored in a CSV file (`calories.csv`) with the following structure:
- Transaction ID (unique identifier)
- Food name
- Calories
- Protein (g)
- Carbohydrates (g)
- Fats (g)
- Date (YYYY-MM-DD)
- Meal type

## Customization

### Styling
Modify `static/style.css` to customize the appearance. The app uses CSS custom properties (variables) for easy theming.

### Functionality
Extend `static/script.js` to add new features or modify existing behavior.

### Backend
Update `app.py` to add new API endpoints or modify data handling.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Note**: This application was converted from a Jupyter notebook command-line interface to a modern web application, maintaining all original functionality while adding a beautiful, responsive user interface.