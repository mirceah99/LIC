const UstensilService = require("../services/ustensil.service");

exports.addUstensil = async (req, res) => {
	if (!req.body?.name) {
		return res.status(400).json({
			message: "Body should contain name!",
		});
	}

	try {
		const ustensilLink = await UstensilService.addUstensil(req.body);
		return res.status(200).json({
			data: ustensilLink,
			message: "Ustensil succesfully added to database",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getUstensilByUID = async (req, res) => {
	try {
		const ustensil = await UstensilService.getUstensilByUID(req.params.id);
		return res
			.status(200)
			.json({ data: ustensil, message: "Ustensil succesfully retrieved" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getUstensilByName = async (req, res) => {
	try {
		const ustensil = await UstensilService.getUstensilByName(req.params.name);
		return res
			.status(200)
			.json({ data: ustensil, message: "Ustensil successfully retrieved" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.deleteUstensilByUID = async (req, res) => {
	try {
		await UstensilService.deleteUstensilByUID(req.params.id);
		return res.status(200).json({ message: "Ustensil successfully deleted" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
