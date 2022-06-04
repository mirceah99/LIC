const CollectionService = require("../services/collection.service");
const { decryptId, makeLink } = require("../middleware/utilities");

const base = "/users/collections/";

exports.addCollectionToUser = async (req, res) => {
	try {
		req.params.id = decryptId(req.params.id)[0];

		if (!req.params.id)
			return res.status(404).json({
				message: "User not found",
			});

		if (!req.body?.name) {
			return res.status(400).json({
				message: "Body should contain name!",
			});
		}

		const addedCollection = await CollectionService.addCollectionToUserById(req.params.id, req.body);
		const addCollectionResponse = makeLink(base, addedCollection.id);

		return res.status(200).json({
			data: addCollectionResponse,
			message: "Collection successfully added to database",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getCollectionById = async (req, res) => {
	try {
		req.params.id = decryptId(req.params.id)[0];

		if (!req.params.id)
			return res.status(404).json({
				message: "Collection not found",
			});

		const collection = await CollectionService.getCollectionById(req.params.id);

		return res.status(200).json({
			data: collection,
			message: "Collection successfully retrieved",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.searchCollections = async (req, res) => {
	try {

		const searchedCollections = await CollectionService.searchCollections(req.body);
		let searchedCollectionsResponse = [];
		for (let searchedCollection of searchedCollections)
			searchedCollectionsResponse.push(makeLink(base, searchedCollection.id));

		return res.status(200).json({
			data: searchedCollectionsResponse,
			message: "Collections successfully retrieved",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.updateCollectionById = async (req, res) => {
	try {
		req.params.id = decryptId(req.params.id)[0];

		if (!req.params.id)
			return res.status(404).json({
				message: "Collection not found",
			});

		if (req.body.userId) {
			req.body.userId = decryptId(req.body.userId)[0];
			if (!req.body.userId)
				return res.status(404).json({
					message: "User not found by id",
				});
		}

		const updatedCollection = await CollectionService.updateCollectionById(req.params.id, req.body);
		const updateCollectionByIdResponse = makeLink(base, updatedCollection.id);

		return res.status(200).json({
			data: updateCollectionByIdResponse,
			message: "Collection successfully updated",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.deleteCollectionById = async (req, res) => {
	try {
		req.params.id = decryptId(req.params.id)[0];

		if (!req.params.id)
			return res.status(404).json({
				message: "Collection not found",
			});

		await CollectionService.deleteCollectionById(req.params.id);

		return res.status(200).json({
			message: "Collection successfully deleted",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};