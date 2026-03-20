import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';

// Pages (to be created)
const Dashboard = () => <div className="page">Dashboard - Coming Soon</div>;
const MealPlanner = () => <div className="page">Weekly Meal Planner - Coming Soon</div>;
const Recipes = () => <div className="page">Recipe Manager - Coming Soon</div>;
function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>🍽️ Family Meal Planner</h1>
              <p className="tagline">Plan your week - Grocery lists handled by Einkaufsliste</p>
            </div>
            <nav className="nav">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/planner" className="nav-link">Weekly Planner</Link>
              <Link to="/recipes" className="nav-link">Recipes</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<MealPlanner />} />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>🍳 Made with love for families who love good food</p>
          <p className="footer-note">
            Start planning your week every Friday evening or Saturday morning!
            <br />
            <small>Grocery lists: Use your existing Einkaufsliste app</small>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;