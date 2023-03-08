import React from 'react'

function AddContact({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) {
  return (
    <form onSubmit={addPerson}>
    <div>
      name: <input placeholder="Enter Name!" value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input placeholder="Enter Number!" value={newNumber} onChange={handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

export default AddContact