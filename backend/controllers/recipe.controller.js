const RecipeService = require('../services/recipe.service');
const TagService = require('../services/tag.service');

exports.addRecipe = async (req, res) => {
	if (!req.body?.name || !req.body?.description) {
		res.status(400).json({
			message: 'Body should firstly contain name and description!',
		});
	}

	if (!req.body?.prepTime || !req.body?.cookingTime || !req.body?.servingSize) {
		res.status(400).json({
			message: 'Body should contain prep time, cooking time and serving size!',
		});
	}

	try {
		const recipeLink = await RecipeService.addRecipe(req.body);
		return res.status(200)
			.json({ data: recipeLink, message: 'Recipe successfully added to database' });
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};

exports.getRecipeById = async (req, res) => {
	try {
		const recipe = await RecipeService.getRecipeById(req.params.id);
		return res.status(200).json({ data: recipe, message: 'Recipe successfully retrieved' });
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};

exports.addImageToRecipe = async (req, res) => {
	if (!req.body?.content) {
		res.status(400).json({
			message: 'Body should contain content!',
		});
	}

	try {
		const imageLink = await RecipeService.addImageToRecipe(req.body, req.params.id);
		return res.status(200)
			.json({ data: imageLink, message: 'Image successfully added to recipe' });
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};

exports.linkTagToRecipe = async (req, res) => {
	if (!req.body?.id) {
		res.status(400).json({
			message: 'Body should contain id!',
		});
	}

	try {
		const tagsForRecipeLink =
			await RecipeService.linkTagToRecipe(req.body.id, req.params.id);
		return res.status(200)
			.json({ data: tagsForRecipeLink, message: 'Tag successfully linked to recipe' });
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};

exports.addInstructionToRecipe = async (req, res) => {
	if (!req.body?.description || !req.body?.step) {
		res.status(400).json({
			message: 'Body should contain description and step!',
		});
	}

	try {
		const instructionLink = await RecipeService.addInstructionToRecipe(req.body, req.params.id);
		return res.status(200)
			.json({
				data: instructionLink,
				message: 'Instruction successfully added to recipe',
			});
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};

exports.linkIngredientToRecipe = async (req, res) => {
	if (!req.body?.id) {
		res.status(400).json({
			message: 'Body should contain ingredient id!',
		});
	}

	if (!req.body?.quantity) {
		res.status(400).json({
			message: 'Body should quantity!',
		});
	}

	if (!req.body?.unitOfMeasurement)
		req.body.unitOfMeasurement = 'g';

	if (!req.body?.optionality)
		req.body.optionality = false;

	try {
		const ingredientsForRecipeLink =
			await RecipeService.linkIngredientToRecipe(req.body, req.params.id);
		return res.status(200)
			.json({
				data: ingredientsForRecipeLink,
				message: 'Ingredient successfully linked to recipe',
			});
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};

exports.linkUstensilToRecipe = async (req, res) => {
	if (!req.body?.id) {
		res.status(400).json({
			message: 'Body should contain ustensil id!',
		});
	}

	try {
		const ustensilForRecipe =
			await RecipeService.linkUstensilToRecipe(req.body.id, req.params.id);
		return res.status(200)
			.json({
				data: ustensilForRecipe,
				message: 'Ustensil successfully linked to recipe',
			});
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};
