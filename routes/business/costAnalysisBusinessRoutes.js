const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/auth');
const authorizeRoles = require('../../middleware/authorizeRoles');
const {
    calculateIngredientsCost,
    calculateProductCost,
    calculateTaxes,
    calculateCompleteCostAnalysis
} = require('../../controllers/costAnalysisBusinessController');

router.post('/costanalysis/calculate/ingredients-cost', authenticateToken, authorizeRoles('chef'), async (req, res) => {
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

router.post('/costanalysis/calculate/product-cost', authenticateToken, authorizeRoles('chef'), async (req, res) => {
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

router.post('/costanalysis/calculate/taxes', authenticateToken, authorizeRoles('chef'), async (req, res) => {
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