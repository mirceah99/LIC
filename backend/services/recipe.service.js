const { recipes, ingredients, macros, micros } = require("../models/index");
const { usersLikes } = require("../models/index");

const { decryptId, CustomError } = require("../middleware/utilities");
const ImageService = require("./image.service");
const TagService = require("./tag.service");
const InstructionService = require("./instruction.service");
const IngredientService = require("./ingredient.service");
const UstensilService = require("./ustensil.service");
const { getImageLinkById } = require("../utilities/picture.services");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.addRecipe = (recipe) => {
	return recipes.create({
		name: recipe.name,
		description: recipe.description,
		prepTime: recipe.prepTime,
		cookingTime: recipe.cookingTime,
		servingSize: recipe.servingSize,
		likes: 0,
		author: recipe.author || null,
		image: recipe.pictureName
			? getImageLinkById("recipes", recipe.pictureName)
			: "default.jpg",
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

exports.calculateMacros = async (ingredients) => {
	let total = {
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
	return total;
}

exports.getRecipeById = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];

	//get recipe main data
	let recipe = await recipes.findByPk(decryptedId);

	//get recipe ingredients
	const ingredients = await recipe.getIngredients();

	//get data for each ingredient and sum macros and micros
	let total = await this.calculateMacros(ingredients);

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

exports.searchRecipes = async (searchOptions) => {
	let queryOptions = {};
	if (searchOptions.filter) {
		if (searchOptions.filter.name)
			queryOptions.where = {
				name: {
					[Op.iLike]: `%${searchOptions.filter.name}%`,
				},
			}
		if (searchOptions.filter.description)
			queryOptions.where = {
				description: {
					[Op.iLike]: `%${searchOptions.filter.description}%`,
				},
			}
		if (searchOptions.filter.prepTime?.start)
			queryOptions.where = {
				prepTime: {
					[Op.gte]: searchOptions.filter.prepTime.start,
				},
			}
		if (searchOptions.filter.prepTime?.end)
			queryOptions.where = {
				prepTime: {
					[Op.lte]: searchOptions.filter.prepTime.end,
				},
			}
		if (searchOptions.filter.cookingTime?.start)
			queryOptions.where = {
				cookingTime: {
					[Op.gte]: searchOptions.filter.cookingTime.start,
				},
			}
		if (searchOptions.filter.cookingTime?.end)
			queryOptions.where = {
				cookingTime: {
					[Op.lte]: searchOptions.filter.cookingTime.end,
				},
			}
		if (searchOptions.filter.servingSize?.start)
			queryOptions.where = {
				servingSize: {
					[Op.gte]: searchOptions.filter.servingSize.start,
				},
			}
		if (searchOptions.filter.servingSize?.end)
			queryOptions.where = {
				servingSize: {
					[Op.lte]: searchOptions.filter.servingSize.end,
				},
			}
		if (searchOptions.filter.author)
			queryOptions.where = {
				author: {
					[Op.iLike]: `%${searchOptions.filter.author}%`,
				},
			}
	}
	if (searchOptions.order) {
		queryOptions.order = searchOptions.order;
	}
	if (searchOptions.limit) {
		queryOptions.limit = searchOptions.limit;
	}
	if (searchOptions.offset) {
		queryOptions.offset = searchOptions.offset;
	}

	queryOptions.include = [{ model: ingredients, include: [macros, micros] }];
	let recipesList = await recipes.findAll(queryOptions)
		.then(res => res)
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while searching recipes", 500);
		})

	let recipesResponse = [];
	for (let recipe of recipesList)
		recipesResponse.push(recipe.get());
	return recipesResponse;
}
