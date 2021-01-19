require('dotenv').config() //for confidential info

const express = require('express')
const app = express()
app.use(express.json()) //json parser

const morgan = require('morgan') //console logging
app.use(morgan('dev'))

const cors = require('cors') //cross orrigin communication, front end port 3000 is allowed to fetch data from backend port 3001
app.use(cors())

app.use(express.static('build')) //redirects get requests to build directory and returns front end

const Person = require('./models/person') //mongoose schema

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    //people is an array containing all db entries
    console.log('inside app.get')
    response.json(people)
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(people => {
      if (people) {
        response.json(people)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    const len = people.length
    const date = new Date()
    response.send(`There are ${len} entries in the db, the date is ${date}`)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log('inside delete, id :', request.params.id)
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

//handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

//handler of error requests
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})