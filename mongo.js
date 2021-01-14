

//THIS FILE IS NOT PART OF THE APPLICATION; JUST FOR TRYING OUT STUFF OR STH: USE PERSON.JS



const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const dbname = "phonebook"

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2] //access input from command line

const url =
    `mongodb+srv://admin_boss:${password}@cluster0.yojkq.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: false
    }
})

personSchema.plugin(uniqueValidator)

const Person = mongoose.model('Person', personSchema)


if (process.argv.length !== 5) {
    console.log(dbname)
    Person.find({}).then(result => {
        result.forEach(per => {
          console.log(per.name, " ", per.number)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    
    const note = new Person({
        name: name,
        number: number,
        date: new Date(),
    })
    
    note.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}







