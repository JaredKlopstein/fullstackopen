import React from 'react'
import Weather from './Weather'

function CountryInfo({country}) {
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
    <Weather capital={country.capital}/>
    </>
  )
}

export default CountryInfo