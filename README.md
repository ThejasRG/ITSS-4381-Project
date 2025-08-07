# 🐍 SnackStack

**A gamified nutrition tracking web application**

*Created by Group 10 for ITSS 4381.5u1 Object-Oriented Programming with Python – Summer 2025*

## Overview

SnackStack transforms nutrition tracking into an engaging, game-like experience where users grow a virtual snake by making healthy food choices. The application features a beautiful blue gradient theme with city skyline elements, inspired by modern UI design principles.

## Features

### 🎮 Gamification Elements
- **Growing Snake Visualization**: Your snake grows longer as you log more snacks
- **Nutrition Score**: Visual feedback based on balanced nutrition intake
- **Color-Coded Progress**: Snake segments change color based on nutrition quality

### 📊 Nutrition Tracking
- **Quick Add Snacks**: Pre-loaded database of common healthy snacks
- **Custom Snack Entry**: Add any food with detailed nutrition information
- **Real-time Progress Bars**: Track calories, protein, carbs, and fats
- **Daily Goal Monitoring**: Visual progress toward daily nutrition targets

### 🎨 Modern Design
- **Snake/City Theme**: Inspired by urban landscapes with geometric patterns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Engaging transitions and growth animations
- **Glass Morphism UI**: Modern frosted glass design elements

### 💾 Data Persistence
- **Local Storage**: Your data persists between sessions
- **Daily Reset**: Fresh start each day while maintaining progress
- **Export Ready**: Easy to extend with cloud sync capabilities

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Graphics**: HTML5 Canvas for snake visualization
- **Storage**: Browser LocalStorage API
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Fonts**: Google Fonts (Poppins)

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (Python, Node.js, or any HTTP server)

### Installation
1. Clone or download the project files
2. Start a local web server in the project directory:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```
3. Open your browser and navigate to `http://localhost:8000`

### Usage
1. **Add Snacks**: Use the quick-add dropdown or custom form to log your food
2. **Watch Your Snake Grow**: Each snack makes your snake longer and changes its color
3. **Monitor Progress**: Check your daily nutrition progress in real-time
4. **Clear Data**: Reset your daily progress with the clear button

## Project Structure

```
SnackStack/
├── index.html          # Main application HTML
├── style.css           # Styling and theme
├── script.js           # Application logic and interactivity
├── PRD.md             # Product Requirements Document
├── README.md          # This file
└── Calorie Tracker.ipynb  # Original Part 1 project (Jupyter notebook)
```

## Key Interactive Features

1. **Form Submissions**: Both quick-add and custom snack forms with validation
2. **Dynamic Snake Visualization**: Canvas-based graphics that respond to user actions
3. **Real-time Updates**: Progress bars and statistics update immediately
4. **Responsive Design**: Adapts to different screen sizes and orientations
5. **Data Persistence**: Saves and loads user data automatically

## Development Process (Vibe Coding)

This project was built using AI-assisted "vibe coding" techniques:

### Prompts Used:
- "Create a snake-themed nutrition app with blue gradient background"
- "Make the snake grow based on nutrition intake"
- "Add interactive forms for logging snacks"
- "Implement progress bars with smooth animations"
- "Create a responsive design with glass morphism effects"

### Iterations:
1. **Initial Structure**: Set up HTML skeleton and basic CSS
2. **Theme Implementation**: Added blue gradient background and city elements
3. **Snake Visualization**: Implemented Canvas-based snake drawing
4. **Interactive Features**: Added forms, validation, and data handling
5. **Polish & Animations**: Enhanced UX with smooth transitions and feedback

### What Worked Well:
- AI assistance for rapid prototyping and design iterations
- Modular approach allowed for easy feature additions
- Canvas API provided flexible graphics capabilities
- LocalStorage integration was straightforward

### Challenges:
- Balancing visual appeal with performance
- Making the snake visualization responsive across devices
- Ensuring smooth animations without impacting usability

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Future Enhancements

- User accounts and cloud synchronization
- Social features and challenges with friends
- Integration with fitness trackers
- Advanced nutrition analysis and recommendations
- Achievement system and badges

## Credits

**Group 10 Members**: [Add your team member names here]

**Course**: ITSS 4381.5u1 Object-Oriented Programming with Python  
**Instructor**: [Instructor Name]  
**Institution**: [University Name]  
**Semester**: Summer 2025

## License

This project is created for educational purposes as part of a university course assignment.

---

*Keep growing your snake! 🐍✨*