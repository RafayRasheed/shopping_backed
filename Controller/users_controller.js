const uuid = require('uuid');
const HTMLError = require('../Model/html_error');
const { validationResult } = require('express-validator');
const Schemas = require('../Model/schemas');
const { commonError, commonJson, getDateAndTime, getDateInt } = require('../common')
//For Hashing & Salt Password
const bcrypt = require('bcryptjs');
// For Authentication
const jwt = require('jsonwebtoken');

const JWT_KEY = 'iammrrrfromkarachi'




const getUsers = async (req, res, next) => {
    let users
    try {
        users = await Schemas.User.find().exec()
    } catch (err) {
        return next(new HTMLError(err.message, 422))
    }
    res.status(200).json(commonJson(1, "Found Successfulyy", { users }));
}




function verifyName(name) {
    if (name && name.length) {
        let reg = /^[a-zA-Z]+$/;
        if (reg.test(name)) {

            if (name.length > 2) {
                return true
            }
            return 'Name is too Short'
        }
        return 'Please Enter a Valid Name'
    }
    return 'Name Cannot be Empty'
}
function verifyEmail(email) {
    if (email && email.length) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(email)) {
            return true
        }
        return 'Please Enter a Valid Email'
    }
    return 'Email Cannot be Empty'
}

function verifyPass(password) {
    if (password && password.length) {
        if (password.length > 5) {
            const reg = /(?=.*[a-zA-Z])(?=.*\d)/
            if (reg.test(password)) {
                return true
            }
            return 'Password must contain letter and a number'
        }
        return 'Password must be at least 6 character'
    }

    return 'Password Cannot be Empty'

}

function varifySinUp(name, email, password) {
    let error = verifyName(name)
    if (error != true) {
        return error
    }
    error = verifyEmail(email)
    if (error != true) {
        return error
    }
    error = verifyPass(password)
    return error
}

const signUp = async (req, res, next) => {
    const validError = validationResult(req);

    if (!validError.isEmpty()) {
        throw new HTMLError('Enter a correct data', 422)
    }
    const { name, email, password } = req.body;
    const isValid = varifySinUp(name, email, password)
    if (isValid != true) {
        return next(new HTMLError(isValid, 422))
    }
    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(password, salt);
    let dateNew = new Date()
    const { date, time, lastUpdate } = getDateAndTime(dateNew)
    let user = {
        name,
        email,
        password: securePass,
        show: true,
        dateInt: getDateInt(dateNew),
        date,
        time,
        lastUpdate
    };

    const createUser = new Schemas.User(user)
    try {
        user = await createUser.save()
    }
    catch (error) {
        if (error.code == 11000) {
            return next(new HTMLError('User already exists with this email address', 422))
        }
        return next(new HTMLError(commonError, 422))
    }
    const tokenData = {
        _id: user._id
    }

    const token = jwt.sign(tokenData, JWT_KEY);

    res.status(200).json(commonJson(1, 'Account Created Successfully', { token, user }))
}




async function ValidPass(param1, param2) {

    return new Promise(function (resolve, reject) {
        bcrypt.compare(param1, param2, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}



const signin = async (req, res, next) => {
    const validError = validationResult(req);

    if (!validError.isEmpty()) {
        throw new HTMLError('Enter email & password', 422)
    }
    const { email, password } = req.body;

    let user;
    try {
        user = await Schemas.User.findOne({ email });
        // user.updateOne({ name: 'as' })
    } catch (error) {
        return next(new HTMLError(commonError, 422))
    }

    if (!user) {
        return next(new HTMLError('Incorrect information', 422))
    }

    const isPassword = await ValidPass(password, user.password)

    if (!isPassword == true) {
        return next(new HTMLError('Incorrect information', 422))
    }
    // let dateNew = new Date()
    // const { lastUpdate } = getDateAndTime(dateNew)
    // user.lastSignIn= lastUpdate

    // try {
    //     await user.save()
    // } catch (error) {
    //     return next(new HTMLError(error, 422))
    // }

    const tokenData = {
        _id: user._id
    }
    const token = jwt.sign(tokenData, JWT_KEY);


    const data = {
        token,
        user,
    }


    res.status(200).json(commonJson(1, 'Sign In Successfully', data))

}


const updateUser = async (req, res, next) => {
    const userId = req.params.pid;
    const { user, token } = req.body;

    let tokenId = ''
    if (!user || !token) {
        return next(new HTMLError(commonError, 422))
    }
    try {
        tokenId = jwt.verify(token, JWT_KEY)._id
    } catch (error) {
        return next(new HTMLError('Authentication Failed', 422))
    }

    if (tokenId != userId) {
        return next(new HTMLError('Authentication Failed', 422))
    }

    let FindUser;
    try {
        FindUser = await Schemas.User.findById(userId);
    } catch (error) {
        return next(new HTMLError(commonError, 422))
    }

    if (!FindUser) {
        return next(new HTMLError('user not found', 422))
    }
    if (user.name) {
        const isValid = verifyName(user.name)
        if (isValid != true) {
            return next(new HTMLError(isValid, 422))
        }
        FindUser.name = user.name
    }
    if (user.password) {
        const isValid = verifyPass(user.password)
        // if(isValid!=true){
        //     return next(new HTMLError(isValid, 422))
        // }

        // FindUser.name = user.name
    }



    try {
        FindUser.save();
    } catch (error) {
        return next(new HTMLError(commonError, 422))
    }

    res.status(200).json(commonJson(1, 'Profile Updated Successfully', FindUser));
}




const getUserDetails = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return next(new HTMLError('Authentication failed', 422))
    }

    //get userId by using token save as userId while creating a user
    try {
        const data = jwt.verify(token, JWT_KEY);
        req.userId = data.userId;
    } catch (error) {
        return next(new HTMLError('Authentication failed', 422))
    }

    let user;
    try {
        user = await Schemas.User.findById(req.userId).select('-password');
    } catch (error) {
        return next(new HTMLError(commonError, 422))
    }

    res.status(200).json(user)
}





const getUserById = async (req, res, next) => {
    const userId = req.params.pid;
    let user;
    try {
        user = await Schemas.User.findById(userId);
    } catch (error) {
        return next(new HTMLError(commonError, 422))
    }

    if (!user) {
        return next(new HTMLError('user not found', 422))
    }
    res.status(200).json(user);
}






const deleteUser = async (req, res, next) => {
    const userId = req.params.pid;
    let user;

    try {
        user = await Schemas.User.findById(userId)
    } catch (error) {
        return next(new HTMLError(commonError, 422))
    }

    if (!user) {
        return next(new HTMLError('user not found', 422))
    }

    try {
        await user.deleteOne()
    } catch (error) {
        return next(new HTMLError(commonError, 422))
    }
    res.status(200).json({ message: `Deleted successfully` });
}


exports.getUsers = getUsers;
exports.signin = signin;
exports.signUp = signUp;
exports.updateUser = updateUser;
exports.getUserById = getUserById;
exports.deleteUser = deleteUser;
exports.getUserDetails = getUserDetails;
// exports.getUserDetails = verifyName;
// exports.getUserDetails = verifyEmail;
// exports.getUserDetails = verifyPass;
// exports.getUserDetails = varifySinUp;
