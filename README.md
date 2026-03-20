# Family Weekly Meal Planner 🍽️

A practical meal planning app for families and individuals to plan weekly meals. 
**Note:** Grocery list functionality is handled by a separate Einkaufsliste app.

## 🎯 Core Features

### MVP (Version 1.0) - Planning Only
1. **Weekly Planning Interface**
   - Visual calendar for Monday-Sunday
   - Mark meals as "home" or "away" (eating out)
   - Set number of people per meal
   - Select dishes from recipe database

2. **Recipe Management**
   - Add/edit/delete personal recipes
   - Categorize recipes (breakfast, lunch, dinner, snack)
   - Add ingredients with quantities (for reference only)
   - Add preparation instructions

3. **Meal Plan Generator**
   - Suggests weekly meal plans based on preferences
   - Avoids recipe repetition
   - Considers meal types (breakfast, lunch, dinner)

**Note:** Grocery list generation is handled by a separate Einkaufsliste app.

### Future Enhancements
- Nutritional constraints (calories, macros, dietary restrictions)
- Budget tracking
- Leftovers management
- Integration with grocery delivery services
- Meal prep scheduling
- Family member preferences/allergies

## 🏗️ Architecture

```
mealPlaner/
├── frontend/          # React application
├── backend/           # Node.js/Express API
├── database/          # SQLite database
└── docs/             # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### Running Locally
```bash
# Start backend server (port 3001)
cd backend
npm run dev

# Start frontend development server (port 3000)
cd frontend
npm start
```

## 📁 Project Structure Details

### Backend (Node.js/Express)
- REST API for recipes, meal plans, grocery lists
- SQLite database for data persistence
- Recipe CRUD operations
- Meal plan generation logic
- Grocery list calculation

### Frontend (React)
- Weekly calendar view
- Recipe management interface
- Grocery list display
- Responsive design for mobile/desktop

## 🍳 Example Workflow

1. **Add Recipes**: Input your family's favorite dishes with ingredients
2. **Plan Week**: Drag & drop recipes onto the weekly calendar
3. **Set Details**: Specify "home/away", number of people for each meal
4. **Generate List**: One-click grocery list generation
5. **Shop**: Use the organized list at the store

## 🎨 Design Principles

- **Simple & Intuitive**: Friday evening/Saturday morning usability
- **Family-Focused**: Multiple people, different meal types
- **Practical**: Real grocery lists for real shopping trips
- **Extensible**: Foundation for future smart features

## 🤝 Contributing

This is a personal project focused on solving real meal planning problems for families and individuals.