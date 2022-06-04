const AuthorService = require("../services/author.service");
const { decryptId, makeLink } = require("../middleware/utilities");

const base = "/authors/";

exports.addAuthor = async (req, res) => {
	try {
		if (!req.body?.name) {
			return res.status(400).json({
				message: "Body should contain name!",
			});
		}

		if (!req.body?.link) {
			return res.status(400).json({
				message: "Body should contain link!",
			});
		}

		const addedAuthor = await AuthorService.addAuthor(req.body);
		const addAuthorResponse = makeLink(base, addedAuthor.id);

		return res.status(200).json({
			data: addAuthorResponse,
			message: "Author successfully added to database",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getAuthorById = async (req, res) => {
	try {
		req.params.id = decryptId(req.params.id)[0];

		if (!req.params.id)
			return res.status(404).json({
				message: "Author not found",
			});

		const author = await AuthorService.getAuthorById(req.params.id);
		const getAuthorByIdResponse = {
			link: author.link,
			name: author.name,
		};

		return res.status(200).json({
			data: getAuthorByIdResponse,
			message: "Author successfully retrieved",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.searchAuthors = async (req, res) => {
	try {

		const searchedAuthors = await AuthorService.searchAuthors(req.body);
		let searchedAuthorsResponse = [];
		for (let searchedAuthor of searchedAuthors)
			searchedAuthorsResponse.push(makeLink(base, searchedAuthor.id));

		return res.status(200).json({
			data: searchedAuthorsResponse,
			message: "Authors successfully retrieved",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.updateAuthorById = async (req, res) => {
	try {
		req.params.id = decryptId(req.params.id)[0];

		if (!req.params.id)
			return res.status(404).json({
				message: "Author not found",
			});

		const updatedAuthor = await AuthorService.updateAuthorById(req.params.id, req.body);
		const updateAuthorByIdResponse = makeLink(base, updatedAuthor.id);

		return res.status(200).json({
			data: updateAuthorByIdResponse,
			message: "Author successfully updated",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.deleteAuthorById = async (req, res) => {
	try {
		req.params.id = decryptId(req.params.id)[0];

		if (!req.params.id)
			return res.status(404).json({
				message: "Author not found",
			});

		await AuthorService.deleteAuthorById(req.params.id);

		return res.status(200).json({
			message: "Author successfully deleted",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
