require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.static("build"));
app.use(express.json());
// app.use(morgan('tiny'))
// the below morgan logs :content if the content is from a post request using custom token content
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);
app.use(cors());

morgan.token("content", (request) =>
  request.method === "POST" && request.body.name
    ? `Name: ${request.body.name} Number: ${request.body.number}`
    : ""
);

//Info Page
app.get("/info", (request, response) => {
  let date = new Date();
  Person.find({})
  .then(persons => {
    response.send(
      `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `
    )
  })
});

//get all persons using mongoose model
app.get("/api/persons", (request, response, next) => {
  Person.find({})
  .then((notes) => {
    response.json(notes);
  })
  .catch((error) => {
    next(error);
  });
});

//get specific person using mongoose
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
  .then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  })
  .catch((error) => {
    next(error);
  });
});

// deletion of person
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
});

// post request
app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  const name = body.name;
  const number = body.number;
  // // if name or number is missing, return error
  //   if (!body.name || !body.number) {
  //     return response.status(400).json({
  //       error: 'content missing'
  //     })
  //  }
  //   // if name exists, return error
  //   if(persons.find(person => person.name.toLowerCase() === name.toLowerCase())){
  //       return response.status(400).json({
  //         error: 'name must be unique'
  //       })
  //     }

  const person = new Person({
    name: name,
    number: number,
  });

  person.save()
  .then((savedPerson) => {
    response.json(savedPerson);
  })
  .catch((error) => {
    next(error);
  });
});

//updating a person 
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, 
    {name, number}, 
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//unknown endpoint handler 
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

//error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

// creates the express webserver
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
