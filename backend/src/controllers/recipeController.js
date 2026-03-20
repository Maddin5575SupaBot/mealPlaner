const RecipeModel = require('../models/recipeModel');

class RecipeController {
  // Get all recipes
  static async getAllRecipes(req, res) {
    try {
      const recipes = await RecipeModel.findAll();
      res.json(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Failed to fetch recipes' });
    }
  }
  
  // Get recipe by ID
  static async getRecipeById(req, res) {
    try {
      const recipe = await RecipeModel.findById(req.params.id);
      
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      
      res.json(recipe);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  }
  
  // Create new recipe
  static async createRecipe(req, res) {
    try {
      const { name, description, category, prep_time, cook_time, servings, instructions, ingredients } = req.body;
      
      // Validate required fields
      if (!name || !category) {
        return res.status(400).json({ error: 'Name and category are required' });
      }
      
      const recipeData = {
        name,
        description: description || '',
        category,
        prep_time: prep_time || 0,
        cook_time: cook_time || 0,
        servings: servings || 1,
        instructions: instructions || '',
        ingredients: ingredients || []
      };
      
      const newRecipe = await RecipeModel.create(recipeData);
      res.status(201).json(newRecipe);
    } catch (error) {
      console.error('Error creating recipe:', error);
      res.status(500).json({ error: 'Failed to create recipe' });
    }
  }
  
  // Update recipe
  static async updateRecipe(req, res) {
    try {
      const { name, description, category, prep_time, cook_time, servings, instructions, ingredients } = req.body;
      
      // Validate required fields
      if (!name || !category) {
        return res.status(400).json({ error: 'Name and category are required' });
      }
      
      const recipeData = {
        name,
        description: description || '',
        category,
        prep_time: prep_time || 0,
        cook_time: cook_time || 0,
        servings: servings || 1,
        instructions: instructions || '',
        ingredients: ingredients || []
      };
      
      const updatedRecipe = await RecipeModel.update(req.params.id, recipeData);
      
      if (!updatedRecipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      
      res.json(updatedRecipe);
    } catch (error) {
      console.error('Error updating recipe:', error);
      res.status(500).json({ error: 'Failed to update recipe' });
    }
  }
  
  // Delete recipe
  static async deleteRecipe(req, res) {
    try {
      const deleted = await RecipeModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(500).json({ error: 'Failed to delete recipe' });
    }
  }
  
  // Search recipes
  static async searchRecipes(req, res) {
    try {
      const { q: query, category } = req.query;
      const recipes = await RecipeModel.search(query, category);
      res.json(recipes);
    } catch (error) {
      console.error('Error searching recipes:', error);
      res.status(500).json({ error: 'Failed to search recipes' });
    }
  }
  
  // Get recipe categories
  static async getCategories(req, res) {
    try {
      const categories = await RecipeModel.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }
  
  // Get recipes by category
  static async getRecipesByCategory(req, res) {
    try {
      const recipes = await RecipeModel.findByCategory(req.params.category);
      res.json(recipes);
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      res.status(500).json({ error: 'Failed to fetch recipes by category' });
    }
  }
}

module.exports = RecipeController;