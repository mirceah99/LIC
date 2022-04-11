const express = require("express");

const router = express.Router();

const IngredientController = require("../controllers/ingredient.controller");

router.post("/", IngredientController.addIngredient);

router.post("/:id/unit", IngredientController.addIngredientUnit);

router.get("/", IngredientController.getIngredientByName);

router.get("/:id", IngredientController.getIngredientByUID);

router.get("/:id/unit/:unit", IngredientController.getIngredientUnitByUID);

router.put("/:id", IngredientController.updateIngredientByUID);

router.put("/:id/unit/:unit", IngredientController.updateIngredientUnitByUID);

router.delete("/:id", IngredientController.deleteIngredientByUID);

router.delete(
	"/:id/unit/:unit",
	IngredientController.deleteIngredientUnitByUID
);

module.exports = router;
