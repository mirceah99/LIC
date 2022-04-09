const express = require('express');

const router = express.Router();

const IngredientController = require('../controllers/ingredient.controller');

router.post('/', IngredientController.addIngredient);

router.post('/:id/unit', IngredientController.addIngredientUnit);

router.get('/:id', IngredientController.getIngredientByUID);

module.exports = router;
