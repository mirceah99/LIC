const TagService = require('../services/tag.service');

exports.addTag = async (req, res) => {
	if (!req.body?.text) {
		res.status(400).json({
			message: 'Body should contain text!',
		});
	}

	try {
		const tagLink = await TagService.addTag(req.body);
		return res.status(200)
			.json({ data: tagLink, message: 'Tag succesfully added to database' });
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};

exports.getTagById = async (req, res) => {
	try {
		const tag = await TagService.getTagById(req.params.id);
		return res.status(200).json({ data: tag, message: 'Tag succesfully retrieved' });
	} catch (e) {
		return res.status(400).json({ message: e.message });
	}
};
