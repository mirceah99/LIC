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
	const ingredients = await recipe.getIngredients();

	//get data for each ingredient and sum macros and micros
	const total = {
		protein: 0,
		carbs: 0,
		fat: 0,
		fiber: 0,
		sugar: 0,
		saturated: 0,
		polyunsaturated: 0,
		monounsaturated: 0,
		trans: 0,
		sodium: 0,
		potassium: 0,
		vitaminA: 0,
		vitaminC: 0,
		calcium: 0,
		iron: 0,
	};
	for (let ingredient of ingredients) {
		const { dataValues: macros } = await ingredient.getMacro();
		const { dataValues: micros } = await ingredient.getMicro();
		const multiplier =
			ingredient.dataValues.ingredientsForRecipe.dataValues.quantity;
		ingredient.dataValues.macros = macros;
		ingredient.dataValues.micros = micros;
		for (let attr in macros) {
			total[attr] += +macros[attr] * multiplier;
		}
		for (let attr in micros) {
			total[attr] += +micros[attr] * multiplier;
		}
	}
	// calculate total calories
	total.calories = total.protein * 4 + total.carbs * 4 + total.fat * 9;

	recipe = recipe.dataValues;
	let recipeResponse = {
		name: recipe.name,
		description: recipe.description,
		prepTime: recipe.prepTime,
		cookingTime: recipe.cookingTime,
		servingSize: recipe.servingSize,
		likes: recipe.likes,
	};
	recipeResponse.ingredients = ingredients;
	recipeResponse.total = total;
	delete recipeResponse.total.id;
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
