const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user.controller");

const { verifyToken } = require("../middleware/utilities");

router.post("/", UserController.addUser);

router.get("/:id", UserController.getUserByUID);

router.get("/", UserController.getUserByUsernameAndPassword);

router.put("/:id", verifyToken, UserController.updateUser);

router.put("/password/:id", verifyToken, UserController.updateUserPassword);

router.delete("/:id", verifyToken, UserController.deleteUser);

router.get("/confirm-email/:code", UserController.verifyEmail);

module.exports = router;
