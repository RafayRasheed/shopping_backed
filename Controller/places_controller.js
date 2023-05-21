const uuid = require('uuid');
const HTMLError = require('../Model/html_error');
const { validationResult } = require('express-validator');

Dummy_Places = [
    {
        id: '105',
        title: 'not a New',
        description: 'How are You',
        place: {
            lat: 24.884819833564883,
            lng: 67.05989088924855,
        },
        city: 'Karachi',
        country: 'Pakistan',
        creater: '10'
    },
    {
        id: '104',
        title: 'fbgfd New f',
        description: 'How are You',
        place: {
            lat: 24.884819833564883,
            lng: 67.05989088924855,
        },
        city: 'Karachi',
        country: 'Pakistan',
        creater: '9'
    },
    {
        id: '106',
        title: 'New tet',
        description: 'How are You',
        place: {
            lat: 24.884819833564883,
            lng: 67.05989088924855,
        },
        city: 'Karachi',
        country: 'Pakistan',
        creater: '10'
    },

];

const getPlaceById = (req, res, next) => {
    const place_id = req.params.pid;
    const place = Dummy_Places.find((p) => p.id === place_id)

    if (!place) {
        throw new HTMLError("Could not find a place for provided id", 404)
    }
    res.json(place)
}

const getPlacesByUserId = (req, res, next) => {
    const user_id = req.params.uid;
    const places = Dummy_Places.filter((p) => p.creater === user_id)
    if (!places) {
        return next(
            new HTMLError("Could not find a places for provided user id", 404)
        )
    }
    res.json(places)
}

const createPlace = (req, res, next) => {
    const validError = validationResult(req);

    if(!validError.isEmpty()){
        throw new HTMLError("Please enter a coreect data", 404)
    }
    const { title, description, place, city, country, ui } = req.body;
    const createPlace = {
        id: uuid.v4(), title, description, place, city, country, ui
    };
    Dummy_Places.push(createPlace);
    console.log(createPlace)
    res.status(201).json(createPlace)
}

const updatePlace = (req, res, next) => {
    const validError = validationResult(req);

    if(!validError.isEmpty()){
        throw new HTMLError("Failed to update: Please enter a coreect data", 404)
    }
    const { title, description } = req.body;
    place_id = req.params.pid;
    let index = 0
    // const updatedPlace = {...Dummy_Places.find((p) => p.id===place_id)};
    const updatedPlace = {
        ...Dummy_Places.find((p, i) => {
            if (p.id === place_id) {
                index = i
                return p
            }
        })
    };
    updatedPlace.title = title;
    updatedPlace.description = description;
    Dummy_Places[index] = updatedPlace;
    res.status(200).json(updatedPlace)
}

const deletePlace = (req, res, next) => {
    place_id = req.params.pid;
    Dummy_Places = Dummy_Places.filter(p=>p.id!==place_id);
    res.status(200).json({message: "Deleted Successfully"})
}

exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
exports.createPlace = createPlace;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;