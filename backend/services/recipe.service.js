const { recipes } = require("../models/index");
const { usersLikes } = require("../models/index");

const { makeLink, decryptId } = require("../middleware/utilities");
const ImageService = require("./image.service");
const TagService = require("./tag.service");
const InstructionService = require("./instruction.service");
const IngredientService = require("./ingredient.service");
const UstensilService = require("./ustensil.service");

const base = "/recipes/";

exports.addRecipe = async (recipe) => {
	const addedRecipe = await recipes.create({
		name: recipe.name,
		description: recipe.description,
		prepTime: recipe.prepTime,
		cookingTime: recipe.cookingTime,
		servingSize: recipe.servingSize,
		likes: 0,
	});

	return makeLink(base, addedRecipe.dataValues.id.toString());
};

exports.getRecipeById = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];

	//get recipe main data
	let recipe = await recipes.findByPk(decryptedId);

	//get recipe ingredients
	console.log(recipe);
	const ingredients = await recipe.getIngredients();
	console.log(ingredients);

	recipe = recipe.dataValues;
	//TBD
	let recipeResponse = {
		name: recipe.name,
		description: recipe.description,
		prepTime: recipe.prepTime,
		cookingTime: recipe.cookingTime,
		servingSize: recipe.servingSize,
		likes: recipe.likes,
	};
	recipeResponse.ingredients = ingredients;
	return recipeResponse;
};

exports.addImageToRecipe = async (image, recipeId) => {
	await ImageService.addImageToRecipe(image, recipeId);
};

exports.linkTagToRecipe = async (tagId, recipeId) => {
	await TagService.linkTagToRecipe(tagId, recipeId);
};

exports.addInstructionToRecipe = async (instruction, recipeId) => {
	await InstructionService.addInstructionToRecipe(instruction, recipeId);
};

exports.linkIngredientToRecipe = async (ingredientForRecipe, recipeId) => {
	await IngredientService.linkIngredientToRecipe(ingredientForRecipe, recipeId);
};

exports.linkUstensilToRecipe = async (ustensilId, recipeId) => {
	await UstensilService.linkUstensilToRecipe(ustensilId, recipeId);
};

exports.like = async ({ recipeId, toDo }, userId) => {
	const decryptedRecipeId = decryptId(recipeId)[0];
	const decryptedUserId = decryptId(userId)[0];

	if (toDo === "like") {
		await usersLikes.create({
			userId: decryptedRecipeId,
			recipeId: decryptedUserId,
		});
	}
	if (toDo === "unlike") {
		await usersLikes.destroy({
			where: {
				userId: decryptedRecipeId,
				recipeId: decryptedUserId,
			},
		});
	}
};
