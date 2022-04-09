const { recipes } = require('../models/index');
const { makeLink, decryptId } = require('../middleware/utilities');
const ImageService = require('./image.service');
const TagService = require('./tag.service');
const InstructionService = require('./instruction.service');
const IngredientService = require('./ingredient.service');
const UstensilService = require('./ustensil.service');

const base = '/recipes/';

exports.addRecipe = async (recipe) => {
	try {
		const addedRecipe = await recipes.create({
			name: recipe.name,
			description: recipe.description,
			prepTime: recipe.prepTime,
			cookingTime: recipe.cookingTime,
			servingSize: recipe.servingSize,
			likes: 0,
		});

		return makeLink(base, addedRecipe.dataValues.id.toString());
	} catch (e) {
		throw Error(e);
	}
};

exports.getRecipeById = async (encryptedId) => {
	try {
		const decryptedId = decryptId(encryptedId)[0];
		const recipe = (await recipes.findByPk(decryptedId)).dataValues;
		let recipeResponse = {
			name: recipe.name,
			description: recipe.description,
			prepTime: recipe.prepTime,
			cookingTime: recipe.cookingTime,
			servingSize: recipe.servingSize,
			likes: recipe.likes,
		};
		return recipeResponse;
	} catch (e) {
		throw Error(e);
	}
};

exports.addImageToRecipe = async (image, recipeId) => {
	try {
		await ImageService.addImageToRecipe(image, recipeId);
	} catch (e) {
		throw Error(e);
	}
}

exports.linkTagToRecipe = async (tagId, recipeId) => {
	try {
		await TagService.linkTagToRecipe(tagId, recipeId);
	} catch (e) {
		throw Error(e);
	}
}

exports.addInstructionToRecipe = async (instruction, recipeId) => {
	try {
		await InstructionService.addInstructionToRecipe(instruction, recipeId);
	} catch (e) {
		throw Error(e);
	}
}

exports.linkIngredientToRecipe = async (ingredientForRecipe, recipeId) => {
	try {
		await IngredientService.linkIngredientToRecipe(ingredientForRecipe, recipeId);
	} catch (e) {
		throw Error(e);
	}
}

exports.linkUstensilToRecipe = async (ustensilId, recipeId) => {
	try {
		await UstensilService.linkUstensilToRecipe(ustensilId, recipeId);
	} catch (e) {
		throw Error(e);
	}
}
