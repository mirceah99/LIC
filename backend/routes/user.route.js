const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user.controller");

const { verifyToken } = require("../middleware/utilities");

const {
	uploadProfilePictureMiddleware,
} = require("../utilities/picture.services");

router.post("/", UserController.addUser);

router.get("/:id", UserController.getUserByUID);

router.get("/", UserController.getUserByUsernameAndPassword);

router.put("/reset-password", UserController.resetPassword);

router.put("/change-password", UserController.changePassword);

router.put("/:id", verifyToken, UserController.updateUser);

router.put(
	"/profile-picture/:id",
	verifyToken,
	uploadProfilePictureMiddleware,
	UserController.updateUserProfilePicture
);

router.put("/password/:id", verifyToken, UserController.updateUserPassword);

router.delete("/:id", verifyToken, UserController.deleteUser);

router.get("/confirm-email/:code", UserController.verifyEmail);

module.exports = router;
