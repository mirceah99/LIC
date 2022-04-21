const IngredientService = require("../services/ingredient.service");

exports.addIngredient = async (req, res) => {
	if (req.addedPicture) req.body = JSON.parse(req.body.data);
	if (!req.body?.name || !req.body?.macros) {
		return res.status(400).json({
			message: "Body should contain name and macros!",
		});
	}

	if (
		req.body.macros.protein === undefined ||
		req.body.macros.carbs === undefined ||
		req.body.macros.fat === undefined
	) {
		return res.status(400).json({
			message: "Macros should contain protein, carbs and fat!",
		});
	}

	try {
		const ingredientLink = await IngredientService.addIngredient(
			req.body,
			req.addedPicture
		);
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
			message: "Body should contain unit of measurement and miligrams!",
		});
	}

	try {
		const ingredientUnitLink = await IngredientService.addIngredientUnit(
			req.body,
			req.params.id
		);
		return res.status(200).json({
			data: ingredientUnitLink,
			message: "Ingredient Unit successfully added to database",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.addIngredientUnit = async (req, res) => {
	if (!req.body.unitOfMeasurement || !req.body.miligrams) {
		res.status(400).json({
			message: "Body should contain unit of measurement and miligrams!",
		});
	}

	try {
		const ingredientUnitLink = await IngredientService.addIngredientUnit(
			req.body,
			req.params.id
		);
		return res.status(200).json({
			data: ingredientUnitLink,
			message: "Ingredient Unit successfully added to database",
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
		return res.status(e.statusCode || 500).json({ message: e.message });
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

exports.getIngredientUnitByUID = async (req, res) => {
	try {
		const ingredient = await IngredientService.getIngredientUnitByUID(
			req.params.id,
			req.params.unit
		);
		return res.status(200).json({
			data: ingredient,
			message: "Ingredient Unit successfully retrieved",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.updateIngredientByUID = async (req, res) => {
	try {
		const ingredientLink = await IngredientService.updateIngredientByUID(
			req.params.id,
			req.body
		);
		return res.status(200).json({
			data: ingredientLink,
			message: "Ingredient successfully updated",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.updateIngredientUnitByUID = async (req, res) => {
	try {
		const ingredientLink = await IngredientService.updateIngredientUnitByUID(
			req.params.id,
			req.params.unit,
			req.body
		);
		return res.status(200).json({
			data: ingredientLink,
			message: "Ingredient Unit successfully updated",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.deleteIngredientByUID = async (req, res) => {
	try {
		await IngredientService.deleteIngredientByUID(req.params.id);
		return res.status(200).json({ message: "Ingredient successfully deleted" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.deleteIngredientUnitByUID = async (req, res) => {
	try {
		await IngredientService.deleteIngredientUnitByUID(
			req.params.id,
			req.params.unit
		);
		return res
			.status(200)
			.json({ message: "Ingredient Unit successfully deleted" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
