const { collections, authors } = require("../models/index");
const { CustomError } = require("../middleware/utilities");
const UserService = require("./user.service");

exports.addCollectionToUserById = async (userId, collection) => {
	const user = UserService.getUserById(userId);
	return collections.create({
		name: collection.name,
		userId: user.id,
	})
		.then(res => {
			console.log("Added collection ", res.get(), " to user with id ", user.id);
			return res.get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while adding collection to user with id ", user.id, 500);
		})
};

exports.searchCollectionById = async (collectionId) => {
	const collection = await collections.findByPk(collectionId)
		.then(res => res)
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while searching collection by id", 500);
		})
	if (!collection) {
		console.log("Collection with id ", collectionId, " not found");
		return null;
	}
	console.log("Collection with id ", collectionId, " found ", collection.get());
	return collection.get();
};

exports.searchCollections = async (collectionData) => {
	const searchedCollections = await authors.findAll({
		where: {
			...collectionData,
		},
	})
		.then(res => res)
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while searching collections", 500);
		})

	if (!searchedCollections) {
		console.log("Collections with ", collectionData, " not found");
		return null;
	}
	console.log("Collections with ", collectionData, " found ");

	let foundCollections = [];
	for (let searchedCollection of searchedCollections)
		foundCollections.push(searchedCollection.get());
	return foundCollections;
}

exports.getCollectionById = async (collectionId) => {
	const collection = await this.searchCollectionById(collectionId);
	if (!collection) throw new CustomError("Collection with id ", collectionId, " not found", 404);
	return collection;
};

exports.updateCollectionById = async (collectionId, newCollection) => {
	const oldCollection = await this.getCollectionById(collectionId);
	if (newCollection.userId) {
		let user = await UserService.getUserById(newCollection.userId);
		newCollection.userId = user.id;
	}

	return collections.update(
		{
			name: newCollection.name || oldCollection.name,
			userId: newCollection.userId || oldCollection.userId,
		},
		{
			where: { id: collectionId },
			returning: true,
		},
	)
		.then(res => {
			console.log("Updated collection ", res[1][0].get());
			return res[1][0].get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while updating collection", 500);
		})
};

exports.deleteCollectionById = (collectionId) => {
	return collections.destroy({
		where: { id: collectionId },
	})
		.then(res => {
			console.log("Deleted collection with id ", collectionId);
			return res;
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while deleting collection", 500);
		})
};
