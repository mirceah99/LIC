const UstensilService = require("../services/ustensil.service");

exports.addUstensil = async (req, res) => {
	if (!req.body?.name) {
		res.status(400).json({
			message: "Body should contain name!",
		});
	}

	try {
		const ustensilLink = await UstensilService.addUstensil(req.body);
		return res
			.status(200)
			.json({
				data: ustensilLink,
				message: "Ustensil succesfully added to database",
			});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getUstensilById = async (req, res) => {
	try {
		const ustensil = await UstensilService.getUstensilById(req.params.id);
		return res
			.status(200)
			.json({ data: ustensil, message: "Ustensil succesfully retrieved" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
