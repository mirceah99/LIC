const { recipes } = require("../models/index");
const { usersLikes } = require("../models/index");

const { decryptId, CustomError } = require("../middleware/utilities");
const ImageService = require("./image.service");
const TagService = require("./tag.service");
const InstructionService = require("./instruction.service");
const IngredientService = require("./ingredient.service");
const UstensilService = require("./ustensil.service");

exports.addRecipe = (recipe) => {
	return recipes.create({
		name: recipe.name,
		description: recipe.description,
		prepTime: recipe.prepTime,
		cookingTime: recipe.cookingTime,
		servingSize: recipe.servingSize,
		likes: 0,
		author: recipe.author || null,
	})
		.then(async res => {
			console.log("Added recipe", res.get());
			const recipeId = res.get().id;

			for (let ingredientForRecipe of recipe.ingredients) {
				await this.linkIngredientToRecipe(ingredientForRecipe, recipeId);
			}

			for (let index = 0; index < recipe.instructions.length; index++) {
				let instructionObject = {
					step: index + 1,
					description: recipe.instructions[index],
				};
				await this.addInstructionToRecipe(instructionObject, recipeId);
			}

			if (recipe.tags) {
				for (let tag of recipe.tags) {
					await this.linkTagToRecipeByText(tag, recipeId);
				}
			}

			return res.get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError(err.message, err.statusCode || 500);
		})
};

exports.getRecipeById = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];

	//get recipe main data
	const recipe = (await recipes.findByPk(decryptedId)).dataValues;

	//get recipe ingredients

	//TBD
	let recipeResponse = {
		name: recipe.name,
		description: recipe.description,
		prepTime: recipe.prepTime,
		cookingTime: recipe.cookingTime,
		servingSize: recipe.servingSize,
		likes: recipe.likes,
	};
	return recipeResponse;
};

exports.addImageToRecipe = async (image, recipeId) => {
	await ImageService.addImageToRecipe(image, recipeId);
};

exports.linkTagToRecipeByText = async (tagText, recipeId) => {
	await TagService.linkTagToRecipeByText(tagText, recipeId);
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
