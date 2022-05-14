const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/utilities");

const RecipeController = require("../controllers/recipe.controller");
const {
	uploadRecipePictureMiddleware,
} = require("../utilities/picture.services");

router.post("/", uploadRecipePictureMiddleware, RecipeController.addRecipe);

router.post("/:id/image", RecipeController.addImageToRecipe);

router.post("/:id/tag", RecipeController.linkTagToRecipe);

router.post("/:id/instruction", RecipeController.addInstructionToRecipe);

router.post("/:id/ingredient", RecipeController.linkIngredientToRecipe);

router.post("/:id/ustensil", RecipeController.linkUstensilToRecipe);

router.get("/:id", RecipeController.getRecipeById);

router.post("/like", verifyToken, RecipeController.like);

router.get("/liked/:userId", RecipeController.getLiked);

router.get("/user-like/:userId/:recipeId", RecipeController.userLike);

module.exports = router;
