const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tenderSchema = new Schema({
    title: String,
    description: String,
    entityID: String,
    
})

module.exports = mongoose.model('Tender', tenderSchema)