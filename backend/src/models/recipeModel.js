const { v4: uuidv4 } = require('uuid');
const { db, runAsync, getAsync, allAsync } = require('../database/db');

class RecipeModel {
  // Create a new recipe
  static async create(recipeData) {
    const recipeId = uuidv4();
    const { name, description, category, prep_time, cook_time, servings, instructions, ingredients } = recipeData;
    
    try {
      // Start transaction
      await runAsync('BEGIN TRANSACTION');
      
      // Insert recipe
      await runAsync(
        `INSERT INTO recipes (id, name, description, category, prep_time, cook_time, servings, instructions) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [recipeId, name, description, category, prep_time, cook_time, servings, instructions]
      );
      
      // Insert ingredients if provided
      if (ingredients && ingredients.length > 0) {
        for (const ingredient of ingredients) {
          const ingredientId = uuidv4();
          await runAsync(
            `INSERT INTO ingredients (id, recipe_id, name, quantity, unit, category) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [ingredientId, recipeId, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.category]
          );
        }
      }
      
      await runAsync('COMMIT');
      
      // Return the created recipe with ingredients
      return await this.findById(recipeId);
    } catch (error) {
      await runAsync('ROLLBACK');
      throw error;
    }
  }
  
  // Get all recipes
  static async findAll() {
    const recipes = await allAsync('SELECT * FROM recipes ORDER BY created_at DESC');
    
    // Get ingredients for each recipe
    for (const recipe of recipes) {
      recipe.ingredients = await allAsync(
        'SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY category, name',
        [recipe.id]
      );
    }
    
    return recipes;
  }
  
  // Find recipe by ID
  static async findById(id) {
    const recipe = await getAsync('SELECT * FROM recipes WHERE id = ?', [id]);
    
    if (recipe) {
      recipe.ingredients = await allAsync(
        'SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY category, name',
        [id]
      );
    }
    
    return recipe;
  }
  
  // Update recipe
  static async update(id, recipeData) {
    const { name, description, category, prep_time, cook_time, servings, instructions, ingredients } = recipeData;
    
    try {
      await runAsync('BEGIN TRANSACTION');
      
      // Update recipe
      await runAsync(
        `UPDATE recipes 
         SET name = ?, description = ?, category = ?, prep_time = ?, cook_time = ?, servings = ?, instructions = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [name, description, category, prep_time, cook_time, servings, instructions, id]
      );
      
      // Delete existing ingredients
      await runAsync('DELETE FROM ingredients WHERE recipe_id = ?', [id]);
      
      // Insert new ingredients
      if (ingredients && ingredients.length > 0) {
        for (const ingredient of ingredients) {
          const ingredientId = uuidv4();
          await runAsync(
            `INSERT INTO ingredients (id, recipe_id, name, quantity, unit, category) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [ingredientId, id, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.category]
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
  
  // Delete recipe
  static async delete(id) {
    // Cascade delete will handle ingredients
    const result = await runAsync('DELETE FROM recipes WHERE id = ?', [id]);
    return result.changes > 0;
  }
  
  // Search recipes by name or category
  static async search(query, category) {
    let sql = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];
    
    if (query) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${query}%`, `%${query}%`);
    }
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const recipes = await allAsync(sql, params);
    
    // Get ingredients for each recipe
    for (const recipe of recipes) {
      recipe.ingredients = await allAsync(
        'SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY category, name',
        [recipe.id]
      );
    }
    
    return recipes;
  }
  
  // Get recipes by category
  static async findByCategory(category) {
    return await this.search(null, category);
  }
  
  // Get all categories with recipe counts
  static async getCategories() {
    const categories = await allAsync(
      'SELECT category, COUNT(*) as count FROM recipes GROUP BY category ORDER BY category'
    );
    return categories;
  }
}

module.exports = RecipeModel;