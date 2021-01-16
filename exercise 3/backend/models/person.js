//mongoose specific code here

require('dotenv').config() //for confidential info
//connect back end to data base
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String, minlength:3, required: true, unique: true
  },
  number: {
    type: String, minlength:3, required: true, unique: true
  },
  date: {
    type: Date, required: false
  }
})

personSchema.plugin(uniqueValidator)

//gets rid of unnecessary retuns like mongo's id and version
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)