const express = require('express');
const router = express.Router();
const recipeBusinessController = require('../../controllers/recipeBusinessController');
const recipeCrudController = require('../../controllers/recipeCrudController');
const authorizeRoles = require('../../middleware/authorizeRoles');
const authenticateToken = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// POST - Crear receta con cálculo automático de costos (BUSINESS LOGIC)
router.post(
  '/recipe',
  authenticateToken,
  authorizeRoles('chef'),
  upload.single('image'),
  recipeBusinessController.createRecipe
);

// PUT - Actualizar receta con recálculo de costos (BUSINESS LOGIC)
router.put(
  '/recipe/:id/with-calculations',
  authenticateToken,
  authorizeRoles('chef'),
  upload.single('image'),
  recipeCrudController.updateRecipeWithCalculations
);

// GET - Buscar recetas por categoría
router.get('/recipes/category/:category', recipeBusinessController.getRecipesByCategory);

// GET - Buscar receta por nombre
router.get('/recipes/name/:name', recipeBusinessController.getRecipeByName);

module.exports = router;
