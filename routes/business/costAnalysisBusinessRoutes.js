const express = require('express');
const router = express.Router();
const CostAnalysis = require('../../models/costAnalysis');
const Recipe = require('../../models/recipe');
const {
    calculateIngredientsCost,
    calculateProductCost,
    calculateTaxes
} = require('../../controllers/costAnalysisBusinessController');

// POST - Calcular y guardar análisis de costos completo (BUSINESS LOGIC)
router.post('/costanalysis/calculate-and-save', async (req, res) => {
    try {
        const { 
            recipeId, 
            selectedIngredients, 
            ivaPercent = 0, 
            servicePercent = 0,
            margin = 3 
        } = req.body;

        if (!recipeId || !selectedIngredients || selectedIngredients.length === 0) {
            return res.status(400).json({ 
                message: 'recipeId and selectedIngredients are required' 
            });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Paso 1: Calcular costo de ingredientes
        const step1 = await calculateIngredientsCost(selectedIngredients);

        // Paso 2: Calcular costo del producto
        const step2 = calculateProductCost(
            step1.ingredientsCost,
            step1.indirectCost,
            recipe.servings,
            margin
        );

        // Paso 3: Calcular impuestos
        const step3 = calculateTaxes(
            step2.suggestedPricePerServing,
            ivaPercent,
            servicePercent
        );

        // Crear y guardar el documento
        const document = new CostAnalysis({
            recipeId: recipe._id,
            recipeName: recipe.name,
            servings: recipe.servings,
            ingredients: step1.lines,
            ingredientsCost: step1.ingredientsCost,
            indirectCost: step1.indirectCost,
            totalCost: step2.totalCost,
            costPerServing: step2.costPerServing,
            suggestedPricePerServing: step2.suggestedPricePerServing,
            taxes: step3.taxes
        });
        
        await document.save();
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating cost analysis with calculations', 
            error: error.message 
        });
    }
});

// PUT - Recalcular análisis de costos existente (BUSINESS LOGIC)
router.put('/costanalysis/:id/recalculate', async (req, res) => {
    try {
        const existingDoc = await CostAnalysis.findById(req.params.id);
        if (!existingDoc) {
            return res.status(404).json({ message: 'Cost analysis not found' });
        }

        const { 
            selectedIngredients,
            recalculateIngredients = false,
            recalculateProduct = false,
            recalculateTaxes = false,
            ivaPercent,
            servicePercent,
            margin,
            servings
        } = req.body;

        // Recalcular ingredientes completo
        if (recalculateIngredients && selectedIngredients && selectedIngredients.length > 0) {
            const step1 = await calculateIngredientsCost(selectedIngredients);

            req.body.ingredients = step1.lines;
            req.body.ingredientsCost = step1.ingredientsCost;
            req.body.indirectCost = step1.indirectCost;

            const step2 = calculateProductCost(
                step1.ingredientsCost,
                step1.indirectCost,
                servings || existingDoc.servings,
                margin || 3
            );

            req.body.totalCost = step2.totalCost;
            req.body.costPerServing = step2.costPerServing;
            req.body.suggestedPricePerServing = step2.suggestedPricePerServing;

            const step3 = calculateTaxes(
                step2.suggestedPricePerServing,
                ivaPercent ?? existingDoc.taxes?.ivaPercent ?? 0,
                servicePercent ?? existingDoc.taxes?.servicePercent ?? 0
            );

            req.body.taxes = step3.taxes;
        }
        // Solo recalcular producto
        else if (recalculateProduct) {
            const step2 = calculateProductCost(
                req.body.ingredientsCost ?? existingDoc.ingredientsCost,
                req.body.indirectCost ?? existingDoc.indirectCost,
                servings ?? existingDoc.servings,
                margin || 3
            );

            req.body.totalCost = step2.totalCost;
            req.body.costPerServing = step2.costPerServing;
            req.body.suggestedPricePerServing = step2.suggestedPricePerServing;

            const step3 = calculateTaxes(
                step2.suggestedPricePerServing,
                ivaPercent ?? existingDoc.taxes?.ivaPercent ?? 0,
                servicePercent ?? existingDoc.taxes?.servicePercent ?? 0
            );

            req.body.taxes = step3.taxes;
        }
        // Solo recalcular impuestos
        else if (recalculateTaxes || ivaPercent !== undefined || servicePercent !== undefined) {
            const step3 = calculateTaxes(
                req.body.suggestedPricePerServing ?? existingDoc.suggestedPricePerServing,
                ivaPercent ?? existingDoc.taxes?.ivaPercent ?? 0,
                servicePercent ?? existingDoc.taxes?.servicePercent ?? 0
            );

            req.body.taxes = step3.taxes;
        }

        const document = await CostAnalysis.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        res.json(document);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error recalculating cost analysis', 
            error: error.message 
        });
    }
});

// POST - Calcular costo de ingredientes sin guardar (BUSINESS LOGIC)
router.post('/costanalysis/calculate/ingredients-cost', async (req, res) => {
    try {
        const { selectedIngredients } = req.body;
        
        const result = await calculateIngredientsCost(selectedIngredients);
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ 
            message: 'Error calculating ingredients cost', 
            error: error.message 
        });
    }
});

router.post('/costanalysis/calculate/product-cost', async (req, res) => {
    try {
        const { 
            ingredientsCost,
            indirectCost,
            servings,
            margin = 3
        } = req.body;
        
        const result = calculateProductCost(
            ingredientsCost,
            indirectCost,
            servings,
            margin
        );
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ 
            message: 'Error calculating product cost', 
            error: error.message 
        });
    }
});

router.post('/costanalysis/calculate/taxes', async (req, res) => {
    try {
        const { 
            suggestedPricePerServing,
            ivaPercent = 0, 
            servicePercent = 0
        } = req.body;
        
        const result = calculateTaxes(
            suggestedPricePerServing,
            ivaPercent,
            servicePercent
        );
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ 
            message: 'Error calculating taxes', 
            error: error.message 
        });
    }
});
module.exports = router;