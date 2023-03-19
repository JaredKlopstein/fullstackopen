const express = require('express')
const app = express()

app.use(express.json())

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
    response.json(persons)
  })

// creates the express webserver ?? 
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})