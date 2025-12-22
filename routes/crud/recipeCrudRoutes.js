const express = require('express');
const router = express.Router();
const recipeCrudController = require('../../controllers/recipeCrudController');

router.get('/recipes', recipeCrudController.getAllActiveRecipes);
router.get('/recipes/:id', recipeCrudController.getRecipeById);

router.put('/recipe/:id', recipeCrudController.updateRecipe);

router.delete('/recipe/:id', recipeCrudController.deactivateRecipe);
router.delete('/recipe/:id/force', recipeCrudController.deleteRecipePermanently);

router.patch('/recipe/:id/restore', recipeCrudController.restoreRecipe);

module.exports = router;
