const { ustensils, ustensilsForRecipe } = require('../models/index');
const { makeLink, decryptId } = require('../middleware/utilities');

const base = '/ustensils/';

exports.addUstensil = async (ustensil) => {
	try {
		const addedUstensil = await ustensils.create({
			name: ustensil.name,
		});

		return makeLink(base, addedUstensil.dataValues.id.toString());
	} catch (e) {
		throw Error(e);
	}
};

exports.linkUstensilToRecipe = async (encryptedUstensilId, encryptedRecipeId) => {
	try {
		const decryptedUstensilId = decryptId(encryptedUstensilId)[0];
		const decryptedRecipeId = decryptId(encryptedRecipeId)[0];
		return await ustensilsForRecipe.create({
			ustensilId: decryptedUstensilId,
			recipeId: decryptedRecipeId,
		});
	} catch (e) {
		throw Error(e);
	}
};

exports.getUstensilById = async (encryptedId) => {
	try {
		const decryptedId = decryptId(encryptedId)[0];
		const ustensil = (await ustensils.findByPk(decryptedId)).dataValues;
		return {
			name: ustensil.name,
		};
	} catch (e) {
		throw Error(e);
	}
};
