const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const placeRouter = require('./routes/place_routes');
const userRouter = require('./routes/users_routes')
const HTMLError = require('./Model/html_error');
const mongoos = require('mongoose');
const { commonError, commonJson } = require('./common')

const mongoUri = 'mongodb+srv://rafayrasheed777rr:XaRh2GCQkWAyd9PJ@cluster0.wlict1w.mongodb.net/shopping?retryWrites=true&w=majority';

mongoos.connect(mongoUri).then(() => console.log('database connected')).catch((err) => console.log("app: " + err))

// pass XaRh2GCQkWAyd9PJ

// Allow Javascript Object
app.use(bodyParser.json())

// places routes
// app.use('/places', placeRouter);

//users routes
app.use('/users', userRouter);

//For Invalid Route Error
app.use((req, res, next) => {
    throw new HTMLError('Could not found this route', 404)
})


// For Valid Route Error
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    // Handlw if throw an error from anywhere
    res.json(commonJson(0, error.message || 'Some unknown error accured', {}))

})

app.listen(3000)