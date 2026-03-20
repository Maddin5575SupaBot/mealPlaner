const { v4: uuidv4 } = require('uuid');
const { db, runAsync, getAsync, allAsync } = require('../database/db');

class MealPlanModel {
  // Create a new meal plan
  static async create(mealPlanData) {
    const mealPlanId = uuidv4();
    const { week_start, week_end, name, notes, planned_meals } = mealPlanData;
    
    try {
      await runAsync('BEGIN TRANSACTION');
      
      // Insert meal plan
      await runAsync(
        `INSERT INTO meal_plans (id, week_start, week_end, name, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [mealPlanId, week_start, week_end, name, notes]
      );
      
      // Insert planned meals if provided
      if (planned_meals && planned_meals.length > 0) {
        for (const meal of planned_meals) {
          const mealId = uuidv4();
          await runAsync(
            `INSERT INTO planned_meals (id, meal_plan_id, date, meal_type, location, people_count, recipe_id, custom_meal, notes) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [mealId, mealPlanId, meal.date, meal.meal_type, meal.location || 'home', 
             meal.people_count || 1, meal.recipe_id, meal.custom_meal, meal.notes]
          );
        }
      }
      
      await runAsync('COMMIT');
      return await this.findById(mealPlanId);
    } catch (error) {
      await runAsync('ROLLBACK');
      throw error;
    }
  }
  
  // Get all meal plans
  static async findAll() {
    const mealPlans = await allAsync(
      'SELECT * FROM meal_plans ORDER BY week_start DESC'
    );
    
    // Get planned meals for each meal plan
    for (const plan of mealPlans) {
      plan.planned_meals = await allAsync(
        `SELECT pm.*, r.name as recipe_name, r.category as recipe_category
         FROM planned_meals pm
         LEFT JOIN recipes r ON pm.recipe_id = r.id
         WHERE pm.meal_plan_id = ?
         ORDER BY pm.date, 
           CASE pm.meal_type 
             WHEN 'breakfast' THEN 1
             WHEN 'lunch' THEN 2
             WHEN 'dinner' THEN 3
             WHEN 'snack' THEN 4
             ELSE 5
           END`,
        [plan.id]
      );
    }
    
    return mealPlans;
  }
  
  // Find meal plan by ID
  static async findById(id) {
    const mealPlan = await getAsync('SELECT * FROM meal_plans WHERE id = ?', [id]);
    
    if (mealPlan) {
      mealPlan.planned_meals = await allAsync(
        `SELECT pm.*, r.name as recipe_name, r.category as recipe_category
         FROM planned_meals pm
         LEFT JOIN recipes r ON pm.recipe_id = r.id
         WHERE pm.meal_plan_id = ?
         ORDER BY pm.date, 
           CASE pm.meal_type 
             WHEN 'breakfast' THEN 1
             WHEN 'lunch' THEN 2
             WHEN 'dinner' THEN 3
             WHEN 'snack' THEN 4
             ELSE 5
           END`,
        [id]
      );
    }
    
    return mealPlan;
  }
  
  // Update meal plan
  static async update(id, mealPlanData) {
    const { week_start, week_end, name, notes, planned_meals } = mealPlanData;
    
    try {
      await runAsync('BEGIN TRANSACTION');
      
      // Update meal plan
      await runAsync(
        `UPDATE meal_plans 
         SET week_start = ?, week_end = ?, name = ?, notes = ?
         WHERE id = ?`,
        [week_start, week_end, name, notes, id]
      );
      
      // Delete existing planned meals
      await runAsync('DELETE FROM planned_meals WHERE meal_plan_id = ?', [id]);
      
      // Insert new planned meals
      if (planned_meals && planned_meals.length > 0) {
        for (const meal of planned_meals) {
          const mealId = uuidv4();
          await runAsync(
            `INSERT INTO planned_meals (id, meal_plan_id, date, meal_type, location, people_count, recipe_id, custom_meal, notes) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [mealId, id, meal.date, meal.meal_type, meal.location || 'home', 
             meal.people_count || 1, meal.recipe_id, meal.custom_meal, meal.notes]
          );
        }
      }
      
      await runAsync('COMMIT');
      return await this.findById(id);
    } catch (error) {
      await runAsync('ROLLBACK');
      throw error;
    }
  }
  
  // Delete meal plan
  static async delete(id) {
    // Cascade delete will handle planned_meals
    const result = await runAsync('DELETE FROM meal_plans WHERE id = ?', [id]);
    return result.changes > 0;
  }
  
  // Generate a meal plan (basic version - can be enhanced later)
  static async generateMealPlan(options) {
    const { 
      week_start, 
      week_end, 
      people_count = 1, 
      meal_types = ['breakfast', 'lunch', 'dinner'],
      avoid_repetition = true 
    } = options;
    
    // Get all recipes
    const allRecipes = await allAsync(
      'SELECT * FROM recipes WHERE category IN (?) ORDER BY RANDOM()',
      [meal_types.join(',')]
    );
    
    // Simple generation logic - can be enhanced with AI/constraints later
    const planned_meals = [];
    const usedRecipeIds = new Set();
    const currentDate = new Date(week_start);
    const endDate = new Date(week_end);
    
    while (currentDate <= endDate) {
      for (const meal_type of meal_types) {
        // Filter recipes for this meal type
        const suitableRecipes = allRecipes.filter(recipe => 
          recipe.category === meal_type && 
          (!avoid_repetition || !usedRecipeIds.has(recipe.id))
        );
        
        if (suitableRecipes.length > 0) {
          const randomRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)];
          usedRecipeIds.add(randomRecipe.id);
          
          planned_meals.push({
            date: currentDate.toISOString().split('T')[0],
            meal_type,
            location: 'home',
            people_count,
            recipe_id: randomRecipe.id,
            custom_meal: null,
            notes: `Auto-generated ${meal_type}`
          });
        } else {
          // Fallback: allow repetition if no unique recipes left
          const fallbackRecipes = allRecipes.filter(recipe => recipe.category === meal_type);
          if (fallbackRecipes.length > 0) {
            const randomRecipe = fallbackRecipes[Math.floor(Math.random() * fallbackRecipes.length)];
            
            planned_meals.push({
              date: currentDate.toISOString().split('T')[0],
              meal_type,
              location: 'home',
              people_count,
              recipe_id: randomRecipe.id,
              custom_meal: null,
              notes: `Auto-generated ${meal_type} (repeated recipe)`
            });
          }
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      week_start,
      week_end,
      name: `Auto-generated Plan ${new Date().toLocaleDateString()}`,
      notes: 'Generated automatically based on available recipes',
      planned_meals
    };
  }
  
  // Note: Grocery list calculation removed - using existing Einkaufsliste app instead
  // This method kept as placeholder but returns empty result
  static async calculateGroceryList(mealPlanId) {
    const mealPlan = await this.findById(mealPlanId);
    
    if (!mealPlan) {
      throw new Error('Meal plan not found');
    }
    
    return {
      meal_plan_id: mealPlanId,
      name: `Meal Plan: ${mealPlan.name}`,
      note: 'Grocery list functionality handled by separate Einkaufsliste app',
      items: []
    };
  }
}

module.exports = MealPlanModel;