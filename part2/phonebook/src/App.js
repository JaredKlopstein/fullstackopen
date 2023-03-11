import { useState, useEffect } from 'react'
import AddContact from './components/AddContact'
import Contacts from './components/Contacts'
import Filter from './components/Filter'
import ContactServices from './services/ContactServices'
// import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    ContactServices.getAll().then((contacts) => {
      setPersons(contacts);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    if(persons.find(person => person.name.toLowerCase() === newName.toLowerCase())){
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      ContactServices.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
      newFilter={newFilter} 
      handleFilterChange={handleFilterChange}
      />
      <h2>Add a New Contact</h2>
      <AddContact 
      addPerson={addPerson}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Contacts 
        newFilter={newFilter}
        persons={persons}
      />
    </div>
  )
}

export default App
