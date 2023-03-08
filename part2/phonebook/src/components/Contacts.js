import React from 'react'

function Contacts({ newFilter, persons }) {
  return (
    <ul>
    {(newFilter === '') 
    ? <>{persons.map(person => 
      <li key={person.name}>{person.name} {person.number}</li>
    )}</> 
    : <>
    {persons.filter(person => 
      person.name.toLowerCase().includes(newFilter.toLowerCase())).map(person => 
      <li key={person.name}>{person.name} {person.number}</li>
    )}
    </>}
    
  </ul>
  )
}

export default Contacts