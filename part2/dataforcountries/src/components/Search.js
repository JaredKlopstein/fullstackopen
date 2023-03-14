import React from 'react'

function Search({ newSearch, handleSearchChange }) {
  return (
    <form>
    <div>
      Find Countries: <input placeholder="Search" value={newSearch} onChange={handleSearchChange}/>
    </div>
  </form>
  )
}

export default Search