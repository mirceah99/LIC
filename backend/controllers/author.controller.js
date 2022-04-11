const AuthorService = require("../services/author.service");

exports.addAuthor = async (req, res) => {
	if (!req.body?.name) {
		res.status(400).json({
			message: "Body should contain name!",
		});
	}

	try {
		const authorLink = await AuthorService.addAuthor(req.body);
		return res.status(200).json({
			data: authorLink,
			message: "Author succesfully added to database",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getAuthorByUID = async (req, res) => {
	try {
		const author = await AuthorService.getAuthorByUID(req.params.id);
		return res
			.status(200)
			.json({ data: author, message: "Author successfully retrieved" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.updateAuthorByUID = async (req, res) => {
	try {
		const authorLink = await AuthorService.updateAuthorByUID(
			req.params.id,
			req.body
		);
		return res
			.status(200)
			.json({ data: authorLink, message: "Author successfully updated" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.deleteAuthorByUID = async (req, res) => {
	try {
		await AuthorService.deleteAuthorByUID(req.params.id);
		return res.status(200).json({ message: "Author successfully deleted" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
