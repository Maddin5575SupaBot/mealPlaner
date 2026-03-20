#!/bin/bash

# Family Weekly Meal Planner - Setup Script
echo "🍽️  Setting up Family Weekly Meal Planner (Planning Only)..."
echo "📝 Note: Grocery lists handled by separate Einkaufsliste app"

# Create necessary directories
mkdir -p backend/database
mkdir -p frontend/public

# Install backend dependencies (optional - for full local development)
echo "📦 Installing backend dependencies (optional)..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "🚀 Development:"
echo "1. Start backend (optional): cd backend && npm run dev"
echo "2. Start frontend: cd frontend && npm start"
echo ""
echo "📊 Backend (if running): http://localhost:3001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "🚀 Deployment to GitHub Pages:"
echo "1. Push to GitHub main branch"
echo "2. Auto-deploys to: https://maddin5575.github.io/mealPlaner/"
echo "3. Or manually: cd frontend && npm run deploy"
echo ""
echo "🔧 Features:"
echo "   - Weekly meal planning (home/away meals, people count)"
echo "   - Recipe management"
echo "   - Meal plan generator"
echo "   - No grocery lists (use Einkaufsliste app)"