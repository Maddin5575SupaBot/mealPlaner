const MealPlanModel = require('../models/mealPlanModel');

class MealPlanController {
  // Get all meal plans
  static async getAllMealPlans(req, res) {
    try {
      const mealPlans = await MealPlanModel.findAll();
      res.json(mealPlans);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      res.status(500).json({ error: 'Failed to fetch meal plans' });
    }
  }
  
  // Get meal plan by ID
  static async getMealPlanById(req, res) {
    try {
      const mealPlan = await MealPlanModel.findById(req.params.id);
      
      if (!mealPlan) {
        return res.status(404).json({ error: 'Meal plan not found' });
      }
      
      res.json(mealPlan);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      res.status(500).json({ error: 'Failed to fetch meal plan' });
    }
  }
  
  // Create new meal plan
  static async createMealPlan(req, res) {
    try {
      const { week_start, week_end, name, notes, planned_meals } = req.body;
      
      // Validate required fields
      if (!week_start || !week_end) {
        return res.status(400).json({ error: 'Week start and end dates are required' });
      }
      
      const mealPlanData = {
        week_start,
        week_end,
        name: name || `Meal Plan ${new Date(week_start).toLocaleDateString()}`,
        notes: notes || '',
        planned_meals: planned_meals || []
      };
      
      const newMealPlan = await MealPlanModel.create(mealPlanData);
      res.status(201).json(newMealPlan);
    } catch (error) {
      console.error('Error creating meal plan:', error);
      res.status(500).json({ error: 'Failed to create meal plan' });
    }
  }
  
  // Update meal plan
  static async updateMealPlan(req, res) {
    try {
      const { week_start, week_end, name, notes, planned_meals } = req.body;
      
      // Validate required fields
      if (!week_start || !week_end) {
        return res.status(400).json({ error: 'Week start and end dates are required' });
      }
      
      const mealPlanData = {
        week_start,
        week_end,
        name: name || `Meal Plan ${new Date(week_start).toLocaleDateString()}`,
        notes: notes || '',
        planned_meals: planned_meals || []
      };
      
      const updatedMealPlan = await MealPlanModel.update(req.params.id, mealPlanData);
      
      if (!updatedMealPlan) {
        return res.status(404).json({ error: 'Meal plan not found' });
      }
      
      res.json(updatedMealPlan);
    } catch (error) {
      console.error('Error updating meal plan:', error);
      res.status(500).json({ error: 'Failed to update meal plan' });
    }
  }
  
  // Delete meal plan
  static async deleteMealPlan(req, res) {
    try {
      const deleted = await MealPlanModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Meal plan not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      res.status(500).json({ error: 'Failed to delete meal plan' });
    }
  }
  
  // Generate a meal plan
  static async generateMealPlan(req, res) {
    try {
      const { 
        week_start, 
        week_end, 
        people_count = 1, 
        meal_types = ['breakfast', 'lunch', 'dinner'],
        avoid_repetition = true 
      } = req.body;
      
      if (!week_start || !week_end) {
        return res.status(400).json({ error: 'Week start and end dates are required' });
      }
      
      const options = {
        week_start,
        week_end,
        people_count: parseInt(people_count) || 1,
        meal_types: Array.isArray(meal_types) ? meal_types : ['breakfast', 'lunch', 'dinner'],
        avoid_repetition: avoid_repetition !== false
      };
      
      const generatedPlan = await MealPlanModel.generateMealPlan(options);
      res.json(generatedPlan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      res.status(500).json({ error: 'Failed to generate meal plan' });
    }
  }
  
  // Get grocery list for meal plan
  static async getGroceryList(req, res) {
    try {
      const groceryList = await MealPlanModel.calculateGroceryList(req.params.id);
      res.json(groceryList);
    } catch (error) {
      console.error('Error calculating grocery list:', error);
      if (error.message === 'Meal plan not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to calculate grocery list' });
    }
  }
}

module.exports = MealPlanController;