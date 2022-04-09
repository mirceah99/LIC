const express = require('express');

const router = express.Router();

const TagController = require('../controllers/tag.controller');

router.post('/', TagController.addTag);

router.get('/:id', TagController.getTagById);

module.exports = router;
