const { ustensils, ustensilsForRecipe } = require("../models/index");
const { makeLink, decryptId, CustomError } = require("../middleware/utilities");

const base = "/ustensils/";

async function ustensilExists(name) {
	const ustensilResponse = await ustensils.findAll({
		where: {
			name,
		},
	});
	return ustensilResponse.length !== 0;
}

exports.addUstensil = async (ustensil) => {
	if (await ustensilExists(ustensil.name))
		throw new CustomError("Ustensil already exists", 409);
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

exports.getUstensilByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	const ustensil = (await ustensils.findByPk(decryptedId)).dataValues;
	if (!ustensil) throw new CustomError("Ustensil does not exist", 404);
	return {
		name: ustensil.name,
	};
};

exports.getUstensilByName = async (name) => {
	let ustensil = await ustensils.findAll({
		where: {
			name,
		},
	});
	if (ustensil.length === 0) throw new CustomError("Ustensil does not exist", 404);
	else ustensil = ustensil[0].dataValues;
	return makeLink(base, ustensil.id.toString());
};

exports.deleteUstensilByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	let ustensil = this.getUstenilByUID(encryptedId);
	if (!ustensil || !decryptedId) throw new CustomError("Ustensil does not exist", 404);
	await ustensil.destroy({
		where: { id: decryptedId },
	});
};
