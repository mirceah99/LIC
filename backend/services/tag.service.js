const { tagsForRecipe, tags, authors } = require("../models/index");
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

exports.linkTagToRecipeByText = async (tagText, recipeId) => {
	const tag = await this.getTagByText(tagText);
	return await tagsForRecipe.create({
		tagId: tag.id,
		recipeId: recipeId,
	})
		.then(res => {
			console.log(`Linked tag with id ${tag.id} to recipe with id ${recipeId}`)
			return res;
		})
		.catch(err => {
			console.error(err);
			throw new CustomError(`Error while linking tag ${tag.text} to recipe with id ${recipeId}`, 500);
		})
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
	})
		.then(res => res)
		.catch(err => {
			console.error(err);
			throw new CustomError(`Error while getting tag ${text}`, 500);
		})
	if (!tag || !tag[0]) throw new CustomError(`Tag ${text} not found`, 404);
	console.log("Got tag", tag[0].get());
	return tag[0].get();
};

exports.deleteTagByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	let tag = this.getTagByUID(encryptedId);
	if (!tag || !decryptedId) throw new CustomError("Tag does not exist", 404);
	await tags.destroy({
		where: { id: decryptedId },
	});
};
