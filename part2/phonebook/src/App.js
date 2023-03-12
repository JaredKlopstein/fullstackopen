import { useState, useEffect } from 'react'
import AddContact from './components/AddContact'
import Contacts from './components/Contacts'
import Filter from './components/Filter'
import ContactServices from './services/ContactServices'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  useEffect(() => {
    ContactServices.getAll()
    .then((contacts) => {
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
      update();
    }
    else {
      ContactServices.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setNotificationMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
          setNotificationMessage('')
        }, 3000)
      });
    }
  }

  const deleteContact = (id) => {
    let person = persons.find(person => person.id === id)
    let confirmation = window.confirm(`Do you want to delete ${person.name}`)
    if(confirmation) {
      ContactServices.deleteContact(id).then((returnedPerson) => {
        persons.map((person) => (person.id !== id ? person : returnedPerson));
      }).then(
        setPersons(persons.filter(person => person.id !== id))
      ).catch(error => {
        setErrorMessage(
          `${person.name} has already been deleted from the server.`)
        setTimeout(() => {
          setErrorMessage(null)
          }, 5000)
        })
    }
    else {
      window.alert(`${person.name} not deleted`)
    }
  }

  const update = () => {
    const person = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());
    const changedContact = { ...person, number: newNumber };
    let confirmation = window.confirm(`${person.name} is already added to phonebook, replace the old number with the new one?`)
    if(confirmation) {
      ContactServices
    .update(person.id, changedContact)
    .then(returnedPerson => {
      setPersons(persons.map(contact => contact.id !== person.id ? contact : returnedPerson))
      setNotificationMessage(`Updated ${newName}`)
      setTimeout(() => {
        setNotificationMessage('')
      }, 3000)
      setNewName("");
      setNewNumber("");
      })
  }
  else {
    window.alert(`${person.name} not updated`)
  }
};


  return (
    <div>
      <h2>Phonebook</h2>
      {notificationMessage === '' ? <></> : <Notification message={notificationMessage} type='notification'/>}
      {errorMessage === '' ? <></> : <Notification message={errorMessage} type='error'/>}
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
        deleteContact={deleteContact}
      />
    </div>
  )
}

export default App
