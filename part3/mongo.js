const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://jaredklopstein:${password}@cluster0.hgpsrbc.mongodb.net/phonebookApp?retryWrites=true&w=majority`
async function connect() {
    await mongoose
        .connect(url)
        .then(() => {
            console.log('connected to MongoDB')
            if (process.argv.length > 3) {
                createPerson()
                return
            }
            listAll()
        })
        .catch((error) => {
            console.log('error connecting to MongoDB', error.message)
        })
}

connect()

//MongoDB setup
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)
const person = new Person({
    name: name,
    number: number,
})

//creating a new note
function createPerson() {
    person
        .save()
        .then(() => {
            console.log(`added ${name} ${number} to phonebook`)
            mongoose.connection.close()
        })
        .catch((result) => {
            console.log(result)
            mongoose.connection.close()
        })
}

// finding and printing all notes
function listAll() {
    console.log('phonebook:')
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
