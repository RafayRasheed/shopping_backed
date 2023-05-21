const mongoos = require('mongoose');

const signup = new mongoos.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
});
const CreateUser = mongoos.model("User", signup);


const signin = new mongoos.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
});
const LoginUser = mongoos.model('',signin);


exports.User = CreateUser; 
exports.LoginUser = LoginUser; 