const { tagsForRecipe, tags } = require("../models/index");
const { makeLink, decryptId, CustomError } = require("../middleware/utilities");

const base = "/tags/";

async function tagExists(text) {
	const tagResponse = await tags.findAll({
		where: {
			text,
		},
	});
	return tagResponse.length !== 0;
}

exports.addTag = async (tag) => {
	if (await tagExists(tag.text))
		throw new CustomError("Tag already exists", 409);
	const addedTag = await tags.create({
		text: tag.text,
	});

	return makeLink(base, addedTag.dataValues.id.toString());
};

exports.linkTagToRecipe = async (encryptedTagId, encryptedRecipeId) => {
	const decryptedTagId = decryptId(encryptedTagId)[0];
	const decryptedRecipeId = decryptId(encryptedRecipeId)[0];
	return await tagsForRecipe.create({
		tagId: decryptedTagId,
		recipeId: decryptedRecipeId,
	});
};

exports.getTagByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	let tag = null;
	if (decryptedId) tag = (await tags.findByPk(decryptedId)).dataValues;
	if (!tag) throw new CustomError("Tag does not exist", 404);
	return {
		text: tag.text,
	};
};

exports.getTagByText = async (text) => {
	let tag = await tags.findAll({
		where: {
			text,
		},
	});
	if (tag.length === 0) throw new CustomError("Tag does not exist", 404);
	else tag = tag[0].dataValues;
	return makeLink(base, tag.id.toString());
};

exports.deleteTagByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	let tag = this.getTagByUID(encryptedId);
	if (!tag || !decryptedId) throw new CustomError("Tag does not exist", 404);
	await tags.destroy({
		where: { id: decryptedId },
	});
};
