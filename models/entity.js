const mongoose = require('mongoose')
const Schema = mongoose.Schema

const entitySchema = new Schema({
    name: String,
    adress: String,
})

module.exports = mongoose.model('Entity', entitySchema)