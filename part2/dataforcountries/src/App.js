import { useState, useEffect } from "react";
import Search from "./components/Search";
import Countries from "./components/Countries";
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then((res) => {
      setCountries(res.data)
    })
    }, [])

  

  return (
    <>  
    <h1>Country Data Search</h1>
    <Search 
    newSearch={newSearch}
    handleSearchChange={handleSearchChange}/>
    <Countries countries={countries} newSearch={newSearch}/>
    </>
    );
}

export default App;
