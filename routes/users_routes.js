const express = require('express');
const router = express.Router();
const usersController = require('../Controller/users_controller');
const { check } = require('express-validator');

router.get('/', usersController.getUsers);

router.post('/signup', usersController.signUp);

router.post('/signin',
    [check('email').not().isEmpty(),
    check('password').not().isEmpty()], usersController.signin);

router.patch('/:pid', usersController.updateUser);

router.get('/:pid', usersController.getUserById);

router.delete('/:pid', usersController.deleteUser);

router.post('/getuser', usersController.getUserDetails);

module.exports = router;