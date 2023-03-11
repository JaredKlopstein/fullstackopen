import React from 'react'

function Contacts({ newFilter, persons, deleteContact }) {
  return (
    <ul>
    {(newFilter === '') 
    ? <>{persons.map(person => 
      <li key={person.name}>{person.name} {person.number}<button onClick={() => deleteContact(person.id)}>Delete</button></li>
    )}</> 
    : <>
    {persons.filter(person => 
      person.name.toLowerCase().includes(newFilter.toLowerCase())).map(person => 
      <li key={person.name}>{person.name} {person.number}<button onClick={() => deleteContact(person.id)}>Delete</button></li>
    )}
    </>}
    
  </ul>
  )
}

export default Contacts