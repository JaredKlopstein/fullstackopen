import React from 'react'

function Countries({ newSearch, countries }) {
    let filteredCountries = [];

    if (newSearch.length > 0) {
        filteredCountries = countries.filter(country => 
          country.name.common.toLowerCase().includes(newSearch.toLowerCase()))
      } else {
        filteredCountries = countries
      }

    if (filteredCountries.length > 10) {
        return 'Too many matches, specify another filter'

    }
    else if (filteredCountries.length === 1) {
        const country = filteredCountries[0]
        return (
        <>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h2>Languages</h2>
        <ul>
        {Object.values(country.languages).map((language,index) => <li key={index}>{language}</li>)}
        </ul>
        <img src={Object.values(country.flags)[0]} alt={country.name} width="25%" height="25%" />
        </>
            )
    }   

    return (
    <>
    {filteredCountries.map(country =><h2 key={country.name.common}>{country.name.common}</h2>)}
    </>
  )
}

export default Countries