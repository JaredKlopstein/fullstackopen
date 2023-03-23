require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
// app.use(morgan('tiny'))
// the below morgan logs :content if the content is from a post request using custom token content
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(cors())

morgan.token('content', (request) =>
  request.method === 'POST' && request.body.name
    ? `Name: ${request.body.name} Number: ${request.body.number}`
    : ''
)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
//Intro Page
app.get('/', (request, response) => {
    let date = new Date()
    let contactLength = persons.length;
    response.send(
        `
        <p>Phonebook has info for ${contactLength} people</p>
        <p>${date}</p>
        `)
  })

//get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

//get specific person
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// deletion of person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

// create a new person with a unique id
const generateId = () => {
    const randId = Math.floor((1 + Math.random()) * 0x1000)
    return randId
  }
  // post request
  app.post('/api/persons', (request, response) => {
    const body = request.body;
    const name = request.body.name;
  // if name or number is missing, return error
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    // if name exists, return error 
    if(persons.find(person => person.name.toLowerCase() === name.toLowerCase())){
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }

  //structure person
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
  //adds new person to list
    persons = persons.concat(person)
  
    response.json(person)
  })


// creates the express webserver 
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})