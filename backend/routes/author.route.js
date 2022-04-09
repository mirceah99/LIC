const express = require('express');

const router = express.Router();

const AuthorController = require('../controllers/author.controller');

router.post('/', AuthorController.addAuthor);

router.get('/:id', AuthorController.getAuthorByUID);

router.put('/:id', AuthorController.updateAuthorByUID);

router.delete('/:id', AuthorController.deleteAuthorByUID);

module.exports = router;