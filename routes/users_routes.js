const express = require('express');
const router = express.Router();
const usersController = require('../Controller/users_controller');
const { check } = require('express-validator');

router.get('/', usersController.getUsers);
// router.get('/:pid', usersController.getUserById);
router.get('/sgsgegse', usersController.getUserById);

router.post('/signup', usersController.signUp);
router.post('/signin', usersController.signin);
router.post('/sendEmail', usersController.sendEmail);
// router.post('/getuser', usersController.getUserDetails);

router.patch('/:pid', usersController.updateUser);

router.delete('/:pid', usersController.deleteUser);



module.exports = router;