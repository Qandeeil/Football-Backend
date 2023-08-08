const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String},
    username: {type: String},
    email: {type: String},
    password: {type: String},
    phoneNumber: {type: String},
    address: {type: String},
    country: {type: String},
    profilePicture: {type: String, default: 'https://freesvg.org/img/1389952697.png'},
    bio: {type: String},
    status: {type: Boolean},
    case: {type: String, default: 'user'}
})

const users = mongoose.model('users', userSchema, 'users')
module.exports = users