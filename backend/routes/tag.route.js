const express = require("express");

const router = express.Router();

const TagController = require("../controllers/tag.controller");

router.post("/", TagController.addTag);

router.get("/:id", TagController.getTagByUID);

router.get("/:text", TagController.getTagByText);

router.delete("/:id", TagController.deleteTagByUID);

module.exports = router;
