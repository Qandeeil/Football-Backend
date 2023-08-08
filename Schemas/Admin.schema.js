const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
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
    case: {type: String, default: 'admin'}
})

const admins = mongoose.model('admins', AdminSchema, 'admins')
module.exports = admins