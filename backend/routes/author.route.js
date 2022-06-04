const express = require('express');

const router = express.Router();

const AuthorController = require('../controllers/author.controller');

router.post('/', AuthorController.addAuthor);

router.get('/:id', AuthorController.getAuthorById);

router.get('/', AuthorController.searchAuthors);

router.put('/:id', AuthorController.updateAuthorById);

router.delete('/:id', AuthorController.deleteAuthorById);

module.exports = router;