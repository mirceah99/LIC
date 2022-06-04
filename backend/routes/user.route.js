const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user.controller");

const { verifyToken } = require("../middleware/utilities");

const { uploadProfilePictureMiddleware } = require("../utilities/picture.services");
const CollectionController = require("../controllers/collection.controller");

router.post("/", UserController.addUser);

router.post("/:id", CollectionController.addCollectionToUser);

router.get("/", UserController.getUserByUsernameAndPassword);

router.get("/:id", UserController.getUserById);

router.get("/collections/:id", CollectionController.getCollectionById);

router.get("/collections", CollectionController.searchCollections);

router.put("/reset-password", UserController.resetPassword);

router.put("/change-password", UserController.changePassword);

router.put("/:id", verifyToken, UserController.updateUser);

router.put(
	"/profile-picture/:id",
	verifyToken,
	uploadProfilePictureMiddleware,
	UserController.updateUserProfilePicture,
);

router.put("/password/:id", verifyToken, UserController.updateUserPassword);

router.put("/collections/:id", CollectionController.updateCollectionById);

router.delete("/:id", verifyToken, UserController.deleteUser);

router.delete("/collections/:id", CollectionController.deleteCollectionById);

router.get("/confirm-email/:code", UserController.verifyEmail);

module.exports = router;
