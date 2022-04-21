const TagService = require("../services/tag.service");

exports.addTag = async (req, res) => {
	if (!req.body?.text) {
		return res.status(400).json({
			message: "Body should contain text!",
		});
	}

	try {
		const tagLink = await TagService.addTag(req.body);
		return res
			.status(200)
			.json({ data: tagLink, message: "Tag successfully added to database" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getTagByUID = async (req, res) => {
	try {
		const tag = await TagService.getTagByUID(req.params.id);
		return res
			.status(200)
			.json({ data: tag, message: "Tag successfully retrieved" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getTagByText = async (req, res) => {
	try {
		const tag = await TagService.getTagByText(req.params.text);
		return res
			.status(200)
			.json({ data: tag, message: "Tag successfully retrieved" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.deleteTagByUID = async (req, res) => {
	try {
		await TagService.deleteTagByUID(req.params.id);
		return res.status(200).json({ message: "Tag successfully deleted" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
