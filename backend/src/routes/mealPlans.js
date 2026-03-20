const express = require('express');
const router = express.Router();
const MealPlanController = require('../controllers/mealPlanController');

// GET /api/meal-plans - Get all meal plans
router.get('/', MealPlanController.getAllMealPlans);

// GET /api/meal-plans/:id - Get meal plan by ID
router.get('/:id', MealPlanController.getMealPlanById);

// POST /api/meal-plans - Create new meal plan
router.post('/', MealPlanController.createMealPlan);

// PUT /api/meal-plans/:id - Update meal plan
router.put('/:id', MealPlanController.updateMealPlan);

// DELETE /api/meal-plans/:id - Delete meal plan
router.delete('/:id', MealPlanController.deleteMealPlan);

// POST /api/meal-plans/generate - Generate a meal plan
router.post('/generate', MealPlanController.generateMealPlan);

// GET /api/meal-plans/:id/grocery-list - Calculate grocery list for meal plan
router.get('/:id/grocery-list', MealPlanController.getGroceryList);

module.exports = router;