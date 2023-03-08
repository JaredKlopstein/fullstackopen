import React from 'react'

function Filter({handleFilterChange, newFilter}) {
  return (
    <form>
    <div>
      Filter: <input placeholder="Search" value={newFilter} onChange={handleFilterChange}/>
    </div>
  </form>
  )
}

export default Filter