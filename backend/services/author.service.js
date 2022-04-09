const { makeLink, decryptId, CustomError } = require("../middleware/utilities");
const { authors } = require("../models/index");

const base = "/authors/";

exports.addAuthor = async (author) => {
	const addedAuthor = await authors.create({
		link: author.link,
		name: author.name,
	});
	return makeLink(base, addedAuthor.dataValues.id.toString());
};

exports.getAuthorByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	const author = (await authors.findByPk(decryptedId)).dataValues;
	if (!author) throw new CustomError("Author does not exist", 404);
	return {
		link: author.link,
		name: author.name,
	};
};

exports.updateAuthorByUID = async (encryptedId, newAuthor) => {
	const decryptedId = decryptId(encryptedId)[0];
	let author = this.getAuthorById(encryptedId);
	await authors.update(
		{
			link: newAuthor.link || author.link,
			name: newAuthor.name || author.name,
		},
		{
			where: { id: decryptedId },
		}
	);
	return makeLink(base, decryptedId);
};

exports.deleteAuthorByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	let author = this.getAuthorByUID(encryptedId);
	if (!author) throw new CustomError("Author does not exist", 404);
	await authors.destroy({
		where: { id: decryptedId },
	});
};
