const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, '../../database/mealplanner.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Recipes table
    db.run(`
      CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT CHECK(category IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert')),
        prep_time INTEGER, -- in minutes
        cook_time INTEGER, -- in minutes
        servings INTEGER DEFAULT 1,
        instructions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ingredients table (linked to recipes)
    db.run(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id TEXT PRIMARY KEY,
        recipe_id TEXT NOT NULL,
        name TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        category TEXT CHECK(category IN ('produce', 'dairy', 'meat', 'pantry', 'spices', 'other')),
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
      )
    `);

    // Meal plans table
    db.run(`
      CREATE TABLE IF NOT EXISTS meal_plans (
        id TEXT PRIMARY KEY,
        week_start DATE NOT NULL,
        week_end DATE NOT NULL,
        name TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Planned meals table (individual meals in a plan)
    db.run(`
      CREATE TABLE IF NOT EXISTS planned_meals (
        id TEXT PRIMARY KEY,
        meal_plan_id TEXT NOT NULL,
        date DATE NOT NULL,
        meal_type TEXT CHECK(meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
        location TEXT CHECK(location IN ('home', 'away')) DEFAULT 'home',
        people_count INTEGER DEFAULT 1,
        recipe_id TEXT,
        custom_meal TEXT,
        notes TEXT,
        FOREIGN KEY (meal_plan_id) REFERENCES meal_plans (id) ON DELETE CASCADE,
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE SET NULL
      )
    `);

    // Note: Grocery list functionality removed - using existing Einkaufsliste app instead

    console.log('✅ Database tables initialized');
  });
}

// Helper function for async/await database operations
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db,
  runAsync,
  getAsync,
  allAsync
};