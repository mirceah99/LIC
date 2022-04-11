const { CustomError } = require("../middleware/utilities");
const { images } = require("../models/index");

exports.addImageToRecipe = async (image, recipeId) => {
	if (!image.content) throw new CustomError("Image Content is invalid", 400);
	return await images.create({
		content: image.content,
		recipeId,
	});
};
