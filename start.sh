#!/bin/bash

# Calorie Tracker Web App Startup Script

echo "🍎 Starting Calorie Tracker Web App..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7 or higher."
    exit 1
fi

# Check if requirements are installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Installing dependencies..."
    pip install --break-system-packages -r requirements.txt
fi

# Start the Flask application
echo "🚀 Starting Flask server..."
echo "📱 The app will be available at: http://localhost:5000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

python3 app.py