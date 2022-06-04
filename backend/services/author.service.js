const { CustomError } = require("../middleware/utilities");
const { authors } = require("../models/index");

exports.addAuthor = (author) => {
	return authors.create({
		link: author.link,
		name: author.name,
	})
		.then(res => {
			console.log("Added author ", res.get());
			return res.get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while adding author", 500);
		})
};

exports.searchAuthorById = async (authorId) => {
	const searchedAuthor = await authors.findByPk(authorId)
		.then(res => res)
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while searching author by id", 500);
		})

	if (!searchedAuthor) {
		console.log("Author with id ", authorId, " not found");
		return null;
	}
	console.log("Author with id ", authorId, " found ", searchedAuthor.get());

	return searchedAuthor.get();
}

exports.searchAuthors = async (authorData) => {
	const searchedAuthors = await authors.findAll({
		where: {
			...authorData,
		},
	})
		.then(res => res)
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while searching authors", 500);
		})

	if (!searchedAuthors) {
		console.log("Authors with ", authorData, " not found");
		return null;
	}
	console.log("Authors with ", authorData, " found ");

	let foundAuthors = [];
	for (let searchedAuthor of searchedAuthors)
		foundAuthors.push(searchedAuthor.get());
	return foundAuthors;
}

exports.getAuthorById = async (authorId) => {
	const author = await this.searchAuthorById(authorId);
	if (!author) throw new CustomError("Author not found", 404);
	return author;
};

exports.updateAuthorById = async (authorId, newAuthor) => {
	const oldAuthor = await this.getAuthorById(authorId);
	return authors.update(
		{
			link: newAuthor.link || oldAuthor.link,
			name: newAuthor.name || oldAuthor.name,
		},
		{
			where: { id: authorId },
			returning: true,
		},
	)
		.then(res => {
			console.log("Updated author", res[1][0].get());
			return res[1][0].get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while updating author", 500);
		})
};

exports.deleteAuthorById = (authorId) => {
	return authors.destroy({
		where: { id: authorId },
	})
		.then(res => {
			console.log("Deleted author with id", authorId);
			return res;
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while deleting author", 500);
		})
};
