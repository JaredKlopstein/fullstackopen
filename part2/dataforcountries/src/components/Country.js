import React, { useState } from 'react'
import CountryInfo from './CountryInfo';

function Country({country}) {
    const [selected, setSelected] = useState(false);
    function handleClick() {
        setSelected(!selected)
    }

  return (
    <>
    <h2 key={country.name.common}>{country.name.common} <button onClick={handleClick}>{selected ? 'Hide' : 'Show'}</button></h2>
    {selected && <CountryInfo country={country}/>}
    </>
  )
}

export default Country