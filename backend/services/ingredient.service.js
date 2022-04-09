const { decryptId, makeLink, CustomError } = require('../middleware/utilities');
const { ingredients, ingredientsForRecipe, ingredientUnits } = require('../models/index');
const MacroService = require('./macros.service');
const MicroService = require('./micros.service');

const base = '/ingredients/';

async function ingredientExists(name) {
	const ingredientsResponse = await ingredients.findAll({
		where: {
			name,
		},
	});
	return ingredientsResponse.length !== 0;
}

exports.getIngredientByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	const ingredient = (await ingredients.findByPk(decryptedId)).dataValues;
	if (!ingredient) throw new CustomError('Ingredient does not exist', 404);
	const macros = (await MacroService.getMacro(ingredient.macros));
	const micros = (await MicroService.getMicro(ingredient.micros));
	return {
		name: ingredient.name,
		macros,
		micros,
	};

};

exports.getIngredientByName = async (name) => {
	let ingredient = (await ingredients.findAll({
		where: {
			name,
		},
	}));
	if (ingredient.length === 0) throw CustomError('Ingredient does not exist', 404);
	else ingredient = ingredient[0].dataValues;
	return makeLink(base, ingredient.id.toString());
};

exports.addIngredient = async (ingredient) => {
	if (await ingredientExists(ingredient.name)) throw CustomError('Ingredient already exists', 409);
	const macro = await MacroService.addMacro(ingredient.macros);
	const micro = await MicroService.addMicro(ingredient.micro);
	const addedIngredient = await ingredients.create({
		name: ingredient.name,
		macros: macro.dataValues.id,
		micros: micro.dataValues.id,
	});
	return makeLink(base, addedIngredient.dataValues.id.toString());
};

exports.addIngredientUnit = async (ingredientUnit, encryptedIngredientId) => {
	try {
		const decryptedIngredientForRecipeId = decryptId(encryptedIngredientId.id)[0];
		const addedIngredientUnit = await ingredientUnits.create({
			ingredientId: decryptedIngredientForRecipeId,
			unitOfMeasurement: ingredientUnit.unitOfMeasurement,
			miligrams: ingredientUnit.miligrams,
		});
		return makeLink(base, addedIngredientUnit.dataValues.id.toString());
	} catch (e) {
		throw Error(e);
	}
};

exports.linkIngredientToRecipe = async (ingredientForRecipe, encryptedRecipeId) => {
	try {
		const decryptedIngredientForRecipeId = decryptId(ingredientForRecipe.id)[0];
		const decryptedRecipeId = decryptId(encryptedRecipeId)[0];
		return await ingredientsForRecipe.create({
			ingredientId: decryptedIngredientForRecipeId,
			recipeId: decryptedRecipeId,
			quantity: ingredientForRecipe.quantity,
			unitOfMeasurement: ingredientForRecipe.unitOfMeasurement,
			optionality: ingredientForRecipe.optionality,
		});
	} catch (e) {
		throw Error(e);
	}
};
