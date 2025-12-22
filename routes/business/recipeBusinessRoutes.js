const express = require('express');
const router = express.Router();
const recipeBusinessController = require('../../controllers/recipeBusinessController');

router.post('/recipe', recipeBusinessController.createRecipe);

router.get('/recipes/category/:category', recipeBusinessController.getRecipesByCategory);
router.get('/recipes/name/:name', recipeBusinessController.getRecipeByName);

module.exports = router;
