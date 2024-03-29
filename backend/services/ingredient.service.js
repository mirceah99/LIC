const { decryptId, makeLink, CustomError } = require("../middleware/utilities");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
	ingredients,
	ingredientsForRecipe,
	ingredientUnits,
	macros,
} = require("../models/index");
const MacroService = require("./macros.service");
const MicroService = require("./micros.service");
const RecipeService = require("./recipe.service");
const { getImageLinkById } = require("../utilities/picture.services");
const base = "/ingredients/";

async function ingredientExists(name) {
	const ingredientsResponse = await ingredients.findAll({
		where: {
			name,
		},
	});
	return ingredientsResponse.length !== 0;
}

async function ingredientUnitExists(ingredientId, unitOfMeasurement) {
	const ingredientUnitsResponse = await ingredientUnits.findAll({
		where: {
			ingredientId: ingredientId,
			unitOfMeasurement: unitOfMeasurement,
		},
	});
	return ingredientUnitsResponse.length !== 0;
}

exports.getIngredientByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	const ingredient = (await ingredients.findByPk(decryptedId)).dataValues;
	if (!ingredient || !decryptedId)
		throw new CustomError("Ingredient does not exist", 404);
	const macros = await MacroService.getMacro(ingredient.macros);
	const micros = await MicroService.getMicro(ingredient.micros);
	return {
		name: ingredient.name,
		macros,
		micros,
		image: ingredient.image,
	};
};

exports.getFullIngredientByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	const ingredient = (await ingredients.findByPk(decryptedId)).dataValues;
	if (!ingredient || !decryptedId)
		throw new CustomError("Ingredient does not exist", 404);
	return ingredient;
};

exports.getIngredientById = async (id) => {
	const ingredient = (await ingredients.findByPk(id)).dataValues;
	if (!ingredient || !id)
		throw new CustomError("Ingredient does not exist", 404);
	const macros = await MacroService.getMacro(ingredient.macros);
	const micros = await MicroService.getMicro(ingredient.micros);
	return {
		name: ingredient.name,
		macros,
		micros,
		image: ingredient.image,
	};
};

exports.getIngredientsByRecipeId = async (recipeId) => {
	let ingredients = [];
	return ingredientsForRecipe.findAll({
		where: {
			recipeId: recipeId,
		},
	})
		.then(async res => {
			for (let ingredientForRecipe of res) {
				let ingredient = await this.getIngredientById(ingredientForRecipe.ingredientId);
				ingredients.push(ingredient);
			}
			return ingredients;
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while getting ingredients by recipe", 500);
		})
};

exports.getIngredientByName = async (name) => {
	let ingredient = await ingredients.findAll({
		where: {
			name,
		},
	});
	if (ingredient.length === 0)
		throw new CustomError("Ingredient does not exist", 404);
	else ingredient = ingredient[0].dataValues;
	return makeLink(base, ingredient.id.toString());
};

exports.getIngredientUnitByUID = async (encryptedId, unitOfMeasurement) => {
	const decryptedId = decryptId(encryptedId)[0];
	let ingredientUnit = await ingredientUnits.findAll({
		where: {
			ingredientId: decryptedId,
			unitOfMeasurement: unitOfMeasurement,
		},
	});
	if (ingredientUnit.length === 0 || !decryptedId)
		throw new CustomError("Ingredient Unit does not exist", 404);
	else ingredientUnit = ingredientUnit[0].dataValues;
	return {
		miligrams: ingredientUnit.miligrams,
	};
};

exports.getIngredientByQuery = async (query) => {
	//TODO not checked
	return await ingredients.findAll({
		where: {
			name: { [Op.like]: `%${query.name}%` },
		},
		include: { model: macros, required: true },
	});
};

exports.addIngredient = async (ingredient, pictureName) => {
	//check if te ingredient name is valid ( all ingredients need to have a unique name)
	if (await ingredientExists(ingredient.name))
		throw new CustomError("Ingredient already exists", 409);
	const macro = await MacroService.addMacro(ingredient.macros);
	const micro = await MicroService.addMicro(ingredient.micros);
	const addedIngredient = await ingredients.create({
		name: ingredient.name,
		macros: macro.dataValues.id,
		micros: micro.dataValues.id,
		image: pictureName
			? getImageLinkById("ingredients", pictureName)
			: "default.jpg",
	});
	return makeLink(base, addedIngredient.dataValues.id.toString());
};

exports.addIngredientUnit = async (ingredientUnit, encryptedIngredientId) => {
	const decryptedIngredientForRecipeId = decryptId(encryptedIngredientId)[0];
	if (
		await ingredientUnitExists(
			decryptedIngredientForRecipeId,
			ingredientUnit.unitOfMeasurement,
		)
	)
		throw new CustomError("Ingredient Unit already exists", 409);
	const addedIngredientUnit = await ingredientUnits.create({
		ingredientId: decryptedIngredientForRecipeId,
		unitOfMeasurement: ingredientUnit.unitOfMeasurement,
		miligrams: ingredientUnit.miligrams,
	});
	return (
		makeLink(base, addedIngredientUnit.dataValues.id.toString()) +
		"/" +
		ingredientUnit.unitOfMeasurement
	);
};

exports.linkIngredientToRecipe = (ingredientForRecipe, recipeId) => {
	if (
		!ingredientForRecipe.id ||
		!ingredientForRecipe.quantity ||
		!ingredientForRecipe.unitOfMeasurement
	)
		throw new CustomError("Ingredient for recipe should contain id, quantity and unit of measurement", 400);

	return ingredientsForRecipe.create({
		ingredientId: ingredientForRecipe.id,
		recipeId: recipeId,
		quantity: ingredientForRecipe.quantity,
		unitOfMeasurement: ingredientForRecipe.unitOfMeasurement,
		optionality: ingredientForRecipe.optionality || false,
	})
		.then(res => {
			console.log("Linked ingredient with id ", ingredientForRecipe.id, " to recipe with id ", recipeId);
			return res.get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while linking ingredient to recipe", 500);
		})
};

exports.updateIngredientByUID = async (encryptedId, newIngredient) => {
	const decryptedId = decryptId(encryptedId)[0];
	let ingredient = await this.getFullIngredientByUID(encryptedId);
	if (!ingredient || !decryptedId)
		throw new CustomError("Ingredient does not exist", 404);
	console.log("UPDATEZ MACRO cu",newIngredient.macros);
	await MacroService.updateMacro(ingredient.macros, newIngredient.macros);
	await MicroService.updateMicro(ingredient.micros, newIngredient.micros);
	await RecipeService.updateTotalsOfRecipeByIngredientId(decryptedId);
	await ingredients.update(
		{
			link: newIngredient.link || ingredient.link,
			name: newIngredient.name || ingredient.name,
		},
		{
			where: { id: decryptedId },
		},
	);
	return makeLink(base, decryptedId);
};

exports.updateIngredientUnitByUID = async (
	encryptedId,
	unitOfMeasurement,
	newIngredientUnit,
) => {
	const decryptedId = decryptId(encryptedId)[0];
	let ingredientUnit = await ingredientUnits.findAll({
		where: {
			ingredientId: decryptedId,
			unitOfMeasurement: unitOfMeasurement,
		},
	});
	if (!ingredientUnit || !decryptedId)
		throw new CustomError("Ingredient Unit does not exist", 404);
	await ingredientUnits.update(
		{
			miligrams: newIngredientUnit.miligrams || ingredientUnit.miligrams,
		},
		{
			where: {
				id: decryptedId,
				unitOfMeasurement: unitOfMeasurement,
			},
		},
	);
	return makeLink(base, decryptedId) + "/unit/" + unitOfMeasurement;
};

exports.deleteIngredientByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	let ingredient = this.getIngredientById(encryptedId);
	if (!ingredient || !decryptedId)
		throw new CustomError("Ingredient does not exist", 404);
	await ingredients.destroy({
		where: { id: decryptedId },
	});
};

exports.deleteIngredientUnitByUID = async (encryptedId, unitOfMeasurement) => {
	const decryptedId = decryptId(encryptedId)[0];
	let ingredientUnit = await ingredientUnits.findAll({
		where: {
			ingredientId: decryptedId,
			unitOfMeasurement: unitOfMeasurement,
		},
	});
	if (ingredientUnit.length === 0 || !decryptedId) {
		throw new CustomError("Ingredient Unit does not exist", 404);
	}
	await ingredientUnits.destroy({
		where: {
			ingredientId: decryptedId,
			unitOfMeasurement: unitOfMeasurement,
		},
	});
};
