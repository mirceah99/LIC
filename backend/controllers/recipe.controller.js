const RecipeService = require("../services/recipe.service");

exports.addRecipe = async (req, res) => {
	//TODO CONTINUE THIS
	if (req.addedPicture) req.body = JSON.parse(req.body.data);
	console.log("req.addedPicture", req.addedPicture);
	if (!req.body?.name || !req.body?.description) {
		return res.status(400).json({
			message: "Body should firstly contain name and description!",
		});
	}

	if (!req.body?.prepTime || !req.body?.cookingTime || !req.body?.servingSize) {
		return res.status(400).json({
			message: "Body should contain prep time, cooking time and serving size!",
		});
	}

	try {
		const recipeLink = await RecipeService.addRecipe(req.body);
		return res.status(200).json({
			data: recipeLink,
			message: "Recipe successfully added to database",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getRecipeById = async (req, res) => {
	try {
		const recipe = await RecipeService.getRecipeById(req.params.id);
		return res
			.status(200)
			.json({ data: recipe, message: "Recipe successfully retrieved" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.addImageToRecipe = async (req, res) => {
	if (!req.body?.content) {
		return res.status(400).json({
			message: "Body should contain content!",
		});
	}

	try {
		const imageLink = await RecipeService.addImageToRecipe(
			req.body,
			req.params.id
		);
		return res
			.status(200)
			.json({ data: imageLink, message: "Image successfully added to recipe" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.linkTagToRecipe = async (req, res) => {
	if (!req.body?.id) {
		return res.status(400).json({
			message: "Body should contain id!",
		});
	}

	try {
		const tagsForRecipeLink = await RecipeService.linkTagToRecipe(
			req.body.id,
			req.params.id
		);
		return res.status(200).json({
			data: tagsForRecipeLink,
			message: "Tag successfully linked to recipe",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.addInstructionToRecipe = async (req, res) => {
	if (!req.body?.description || !req.body?.step) {
		return res.status(400).json({
			message: "Body should contain description and step!",
		});
	}

	try {
		const instructionLink = await RecipeService.addInstructionToRecipe(
			req.body,
			req.params.id
		);
		return res.status(200).json({
			data: instructionLink,
			message: "Instruction successfully added to recipe",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.linkIngredientToRecipe = async (req, res) => {
	if (!req.body?.id) {
		return res.status(400).json({
			message: "Body should contain ingredient id!",
		});
	}

	if (!req.body?.quantity) {
		return res.status(400).json({
			message: "Body should quantity!",
		});
	}

	if (!req.body?.unitOfMeasurement) req.body.unitOfMeasurement = "g";

	if (!req.body?.optionality) req.body.optionality = false;

	try {
		const ingredientsForRecipeLink = await RecipeService.linkIngredientToRecipe(
			req.body,
			req.params.id
		);
		return res.status(200).json({
			data: ingredientsForRecipeLink,
			message: "Ingredient successfully linked to recipe",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.linkUstensilToRecipe = async (req, res) => {
	if (!req.body?.id) {
		return res.status(400).json({
			message: "Body should contain ustensil id!",
		});
	}

	try {
		const ustensilForRecipe = await RecipeService.linkUstensilToRecipe(
			req.body.id,
			req.params.id
		);
		return res.status(200).json({
			data: ustensilForRecipe,
			message: "Ustensil successfully linked to recipe",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.like = async (req, res) => {
	try {
		if (!req.body?.recipeId) {
			return res.status(400).json({
				message: "Body should contain an recipe id (recipeId)!",
			});
		}
		if (!req.body?.toDo) {
			return res.status(400).json({
				message:
					"Body should contain a toDo attribute ( it can be like or unlike)!",
			});
		}
		if (req.body?.toDo !== "like") {
			if (req.body?.toDo !== "unlike") {
				return res.status(400).json({
					message:
						"Body should contain a toDo attribute ( it can be like or unlike)!",
				});
			}
		}
		console.log("req.body", req.body, "req.user.id", req.user.id);
		const response = await RecipeService.like(req.body, req.user.id);
		return res.status(200).json({
			data: response,
			message: "Success operation!",
		});
	} catch (e) {
		console.log(e);
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
