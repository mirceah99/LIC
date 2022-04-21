const express = require("express");

const router = express.Router();

const UstensilController = require("../controllers/ustensil.controller");

router.post("/", UstensilController.addUstensil);

router.get("/:id", UstensilController.getUstensilByUID);

router.get("/:name", UstensilController.getUstensilByName);

router.delete("/:id", UstensilController.deleteUstensilByUID);

module.exports = router;
