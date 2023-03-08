import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Jared Klopstein' }
  ]) 
  const [newName, setNewName] = useState('')
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName
    }
    if(persons.find(person => person.name.toLowerCase() === newName.toLowerCase())){
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      setPersons(persons.concat(personObject))
      setNewName('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input placeholder="Enter Name!" value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
      {persons.map(person => 
      <li key={person.name}>{person.name}</li>
      )}
      </ul>
    </div>
  )
}

export default App
