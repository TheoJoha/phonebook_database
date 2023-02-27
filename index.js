const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')


// error-handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :body'))
app.use(express.static('build'))

let persons = []


let information = `Phonebook has info for ${persons.length} people`

let date = new Date()
date = date.toString()

let infoDateObj = {
  info: information,
  date: date
}

let testList = []
testList.push(infoDateObj.info)
testList.push(infoDateObj.date)

// get info
app.get('/info', (request, response) => {
  response.json(Object.values(infoDateObj))
})

// delete a person
app.delete('/api/per/sons/:id', (request, response, next) => {
  // const articleId = Mongoose.Types.ObjectId(req.params.id);
  Person.findByIdAndRemove(request.params.id)
    .then(
      response.status(204).end()
    )
    .catch(error => next(error))
})

// get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// get a person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// add a person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // error checks
  if (body.num === undefined) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  for (let i = 0; i < persons.length; i++) {
    if (body.name === persons[i].name) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  }

  const person = new Person({
    name: body.name,
    num: body.num,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(unknownEndpoint)
app.use(errorHandler) // this has to be the last loaded middleware

const PORT = process.env.PORT || 3001 // Lint is not in full agreement
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
