const express = require('express');

const router = express.Router();

const UstensilController = require('../controllers/ustensil.controller');

router.post('/', UstensilController.addUstensil);

router.get('/:id', UstensilController.getUstensilById);

module.exports = router;
