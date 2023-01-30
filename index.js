require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const app = express()
// const cors = require('cors')
const Person = require('./models/person')


app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :body'))
app.use(express.static('build'))

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// MongoDB

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// set some pre-defined entries
let entries = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "num": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "num": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "num": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "num": "39-23-6423122"
      }
  ]

let information = `Phonebook has info for ${entries.length} people`

let date = new Date()
date = date.toString()

infoDateObj = {
    info: information,
    date: date
}

testList = []
testList.push(infoDateObj.info)
testList.push(infoDateObj.date)

// get info
app.get('/info', (request, response) => {
    response.json(Object.values(infoDateObj))
  })

// get an entry
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// delete an entry
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    entries = entries.filter(entry => entry.id !== id)
  
    response.status(204).end()
  })

// get all entries
/* app.get('/api/persons', (request, response) => {
    response.json(entries)
}) */

app.get('/api/persons', (request, response) => {
  Note.find({}).then(persons => {
    response.json(persons)
  })
})


// add a person
app.post('/api/persons', (request, response) => {
    const body = request.body

    randNum = getRandomInt(10000)

    // error checks
    if (body.num === undefined) {
        return response.status(400).json({ 
        error: 'number missing' 
        })
    }

    if (!body.name === undefined) {
        return response.status(400).json({ 
        error: 'name missing' 
        })
    }

    for (let i = 0; i < entries.length; i++) {
        if (body.name == entries[i].name) {
            return response.status(400).json({ 
            error: 'name must be unique'
            })
        }
    }

    const person = new Person({
      name: body.name,
      num: body.num,
      id: body.randNum,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })

})

morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
