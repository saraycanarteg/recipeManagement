const express = require('express');
const router = express.Router();
const recipeBusinessController = require('../../controllers/recipeBusinessController');
const authorizeRoles = require('../../middleware/authorizeRoles');

// POST - Solo chef
router.post('/recipe', authorizeRoles('chef'), recipeBusinessController.createRecipe);

// GET - Ambos roles
router.get('/recipes/category/:category', recipeBusinessController.getRecipesByCategory);
router.get('/recipes/name/:name', recipeBusinessController.getRecipeByName);

module.exports = router;
