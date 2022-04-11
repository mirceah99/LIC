const { ustensils, ustensilsForRecipe } = require("../models/index");
const { makeLink, decryptId } = require("../middleware/utilities");

const base = "/ustensils/";

exports.addUstensil = async (ustensil) => {
	const addedUstensil = await ustensils.create({
		name: ustensil.name,
	});

	return makeLink(base, addedUstensil.dataValues.id.toString());
};

exports.linkUstensilToRecipe = async (
	encryptedUstensilId,
	encryptedRecipeId
) => {
	const decryptedUstensilId = decryptId(encryptedUstensilId)[0];
	const decryptedRecipeId = decryptId(encryptedRecipeId)[0];
	return await ustensilsForRecipe.create({
		ustensilId: decryptedUstensilId,
		recipeId: decryptedRecipeId,
	});
};

exports.getUstensilById = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	const ustensil = (await ustensils.findByPk(decryptedId)).dataValues;
	return {
		name: ustensil.name,
	};
};
