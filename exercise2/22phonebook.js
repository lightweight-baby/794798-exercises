import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Searchbox = (props) => {
  const search = props.search
  const handleSearch = props.handleSearch
  
  return (
    <div>filter phone book by name: 
      <input
      value={search}
      onChange={handleSearch}/>
    </div>
  )
}

const PersonForm = (props) => {
  const handleName = props.handleName
  const handlePhone = props.handlePhone
  const addName = props.addName
  const newName = props.newName
  const newPhone = props.newPhone
  
  return (
    <form onSubmit={addName}>
      <div>
        name: <input 
        value={newName}
        onChange={handleName}/>
      </div>
      <div>
        number: <input 
        value={newPhone}
        onChange={handlePhone}
        />
        </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Namelist = ({persons}) => (
  persons.map(object => <div key={object.id}>{object.name} {object.number}</div>)
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newPhone, setNewPhone ] = useState('')
  const [ showAll, setShowAll ] = useState(true)
  const [ search, setSearch ] = useState('')

  //fetch data from server db.json
  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])


  const addName = (event) => {
    event.preventDefault()
    
    //check whether name already exists in persons
    const arr = persons.filter(person => person.name === newName)

    //it doesn't exist, add name
    if(!arr.length) {
      const newEntry = {
        name: newName,
        number : newPhone,
        id: persons.length + 1,
      }
      setPersons(persons.concat(newEntry))
    } //otherwise, alert message
    else {
      window.alert(`${newName} is already added to phonebook`)
    }
    
  }

  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handlePhone = (event) => {
    setNewPhone(event.target.value)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase())
    
    //if input exists, filter
    if (event.target.value) {
      setShowAll(false)
    } //otherwise show all names
    else {
      setShowAll(true)
    }
  }

  //personstoshow is the whole array if showall is true, and filtered otherwise
  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(search))

  return (
    <div>
      <h2>Search</h2>
      <Searchbox search={search} handleSearch={handleSearch}/>
      <h2>Add a new contact</h2>
      <PersonForm handleName={handleName} handlePhone={handlePhone} addName={addName} newName={newName} newPhone={newPhone}/>
      <h2>Numbers</h2>
      <Namelist persons={personsToShow}/>
    </div>
  )
}

export default App