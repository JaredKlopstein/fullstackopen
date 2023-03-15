import React from 'react'
import Country from './Country';
import CountryInfo from './CountryInfo';

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
        <CountryInfo key={country.name.common} country={country}/>
        )
    }   

    return (
    <>
    {filteredCountries.map(country =>
        <Country key={country.name.common} country={country}/>)}
    </>
  )
}

export default Countries