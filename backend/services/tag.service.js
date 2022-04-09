const { tagsForRecipe, tags } = require('../models/index');
const { makeLink, decryptId } = require('../middleware/utilities');

const base = '/tags/';

exports.addTag = async (tag) => {
	try {
		const addedTag = await tags.create({
			text: tag.text,
		});

		return makeLink(base, addedTag.dataValues.id.toString());
	} catch (e) {
		throw Error(e);
	}
};

exports.linkTagToRecipe = async (encryptedTagId, encryptedRecipeId) => {
	try {
		const decryptedTagId = decryptId(encryptedTagId)[0];
		const decryptedRecipeId = decryptId(encryptedRecipeId)[0];
		return await tagsForRecipe.create({
			tagId: decryptedTagId,
			recipeId: decryptedRecipeId,
		});
	} catch (e) {
		throw Error(e);
	}
};

exports.getTagById = async (encryptedId) => {
	try {
		const decryptedId = decryptId(encryptedId)[0];
		const tag = (await tags.findByPk(decryptedId)).dataValues;
		return {
			text: tag.text,
		};
	} catch (e) {
		throw Error(e);
	}
};
