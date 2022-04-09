const IngredientService = require("../services/ingredient.service");

exports.addIngredient = async (req, res) => {
	if (!req.body?.name || !req.body?.macros) {
		res.status(400).json({
			message: "Body should contain name and macros!",
		});
	}

	if (
		!req.body.macros.protein ||
		!req.body.macros.carbs ||
		!req.body.macros.fat
	) {
		res.status(400).json({
			message: "Macros should contain protein, carbs and fat!",
		});
	}

	try {
		const ingredientLink = await IngredientService.addIngredient(req.body);
		return res.status(200).json({
			data: ingredientLink,
			message: "Ingredient successfully added to database",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.addIngredientUnit = async (req, res) => {

	if (!req.body.unitOfMeasurement || !req.body.miligrams) {
		res.status(400).json({
			message: 'Body should contain unit of measurement and miligrams!',
		});
	}

	try {
		const ingredientUnitLink = await IngredientService.addIngredientUnit(req.body, req.params.id);
		return res.status(200).json({
			data: ingredientUnitLink,
			message: 'Ingredient Unit succesfully added to database',
		});
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};

exports.getIngredientByUID = async (req, res) => {
	try {
		const ingredient = await IngredientService.getIngredientByUID(
			req.params.id
		);
		return res
			.status(200)
			.json({ data: ingredient, message: "Ingredient successfully retrieved" });
	} catch (e) {
		return res.status(e.statusCode).json({ message: e.message });
	}
};

exports.getIngredientByName = async (req, res) => {
	try {
		const ingredientLink = await IngredientService.getIngredientByName(
			req.body.name
		);
		return res.status(200).json({
			data: ingredientLink,
			message: "Ingredient successfully retrieved",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
