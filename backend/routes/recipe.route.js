const express = require('express');

const router = express.Router();

const RecipeController = require('../controllers/recipe.controller');

router.post('/', RecipeController.addRecipe);

router.post('/:id/image', RecipeController.addImageToRecipe);

router.post('/:id/tag', RecipeController.linkTagToRecipe);

router.post('/:id/instruction', RecipeController.addInstructionToRecipe);

router.post('/:id/ingredient', RecipeController.linkIngredientToRecipe);

router.post('/:id/ustensil', RecipeController.linkUstensilToRecipe);

router.get('/:id', RecipeController.getRecipeById);

module.exports = router;
