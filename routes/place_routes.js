const express = require("express");
const router = express.Router();
const { check } = require('express-validator');

const placeController = require('../Controller/places_controller')

router.get('/:pid', placeController.getPlaceById)

router.get('/user/:uid', placeController.getPlacesByUserId)
 
router.post('/',
    [check('title').not().isEmpty(),
    check('description').isLength({ min: 10 }),],
    placeController.createPlace)

router.patch('/:pid', 
    [check('title').not().isEmpty(),
    check('description').isLength({ min: 10 }),],
    placeController.updatePlace)

router.delete('/:pid', placeController.deletePlace);

module.exports = router;
