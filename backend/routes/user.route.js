const express = require('express');

const router = express.Router();

const UserController = require('../controllers/user.controller');

router.post('/', UserController.addUser);

router.get('/:id', UserController.getUserByUID);

router.get('/', UserController.getUserByUsernameAndPassword);

router.put('/:id', UserController.updateUser);

router.delete('/:id', UserController.deleteUser);

module.exports = router;
