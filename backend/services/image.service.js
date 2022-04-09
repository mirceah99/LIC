const { images } = require('../models/index');

exports.addImageToRecipe = async (image, recipeId) => {
	try {
		if (!image.content) throw Error('Image Content is invalid');
		return await images.create({
			content: image.content,
			recipeId,
		});
	} catch (e) {
		throw Error(e);
	}
};
