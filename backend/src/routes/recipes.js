const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipeController');

// GET /api/recipes - Get all recipes
router.get('/', RecipeController.getAllRecipes);

// GET /api/recipes/search - Search recipes
router.get('/search', RecipeController.searchRecipes);

// GET /api/recipes/categories - Get all categories
router.get('/categories', RecipeController.getCategories);

// GET /api/recipes/category/:category - Get recipes by category
router.get('/category/:category', RecipeController.getRecipesByCategory);

// GET /api/recipes/:id - Get recipe by ID
router.get('/:id', RecipeController.getRecipeById);

// POST /api/recipes - Create new recipe
router.post('/', RecipeController.createRecipe);

// PUT /api/recipes/:id - Update recipe
router.put('/:id', RecipeController.updateRecipe);

// DELETE /api/recipes/:id - Delete recipe
router.delete('/:id', RecipeController.deleteRecipe);

module.exports = router;