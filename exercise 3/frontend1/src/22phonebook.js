import React, { useState, useEffect } from 'react'
import contactService from './services/22servercom'


const Notification = (props) => {
  //notfication takes two props, namely the message that will be displayed
  //and a boolean which determines whether its an error message or not
  const notifStyle = {
    fontSize: 20,
    margin: 20,
    padding: 10,
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: 'green',
  }
  
  const message = props.arr[0]
  const err = props.arr[1]

  if (message === null) {
    return null
  }

  //change output style if error
  if (err) {
    notifStyle.borderColor = 'red'
  }

  return (
    <div style={notifStyle}>
      {message}
    </div>
  )
}


const Searchbox = (props) => {
  const search = props.search
  const setSearch = props.setSearch
  const setShowAll = props.setShowAll
  
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

  return (
    <div>filter phone book by name: 
      <input
      value={search}
      onChange={handleSearch}/>
    </div>
  )
}

const PersonForm = (props) => {
  const [ newName, setNewName ] = useState('')
  const [ newPhone, setNewPhone ] = useState('')
  const persons = props.persons
  const setPersons = props.setPersons
  const setNotification = props.setNotification
  
  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handlePhone = (event) => {
    setNewPhone(event.target.value)
  }

  const vanish = () => {
    setTimeout(() => {
      setNotification([null, false])
    } ,10000)
  }

  const addName = (event) => {
    event.preventDefault()
    
    //check whether name already exists in persons
    const arr = persons.filter(person => person.name === newName)

    //if it doesn't exist, add name
    if(!arr.length) {
      const newEntry = {
        name: newName,
        number : newPhone,
        id: persons[persons.length-1].id + 1,
      }
      //add name to db
      contactService
      .create(newEntry)
      .then(createdPerson => {
        //add name to state array
        //createdPerson.data = newEntry
        setPersons(persons.concat(newEntry))
        setNotification([`'${newName}' created.`, false])
        vanish()
      })
      .catch(error => {
        // this is the way to access the error message
        setNotification([`'${error.response.data.error}'`, true])
        vanish()
      })
      
      
    } //otherwise, alert message and update db
    else {
      if(window.confirm(`Replace ${newName}'s phone number with a new one?`)) {
        const changedEntry = {...arr[0], number:newPhone}
        contactService
        .update(arr[0].id, changedEntry)
        .then(updatedNotes => {
          setPersons(persons.map(x => x.id !== arr[0].id? x : updatedNotes))
          setNotification([`'${newName}' updated.`, false])
          vanish()
        })
        .catch(error => {
          console.log(error)
          setNotification([`failed to update '${newName}'.`, true])
          vanish()
        })
        
      }
    }
  }

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

const Namelist = (props) => {
  const setNotification = props.setNotification
  const setPersons = props.setPersons
  const persons = props.persons

  const confirmation = (name) => (
    window.confirm(`Are you sure you wanna delete ${name}?`)
  )
  
  const vanish = () => {
    setTimeout(() => {
      setNotification([null, false])
    } ,5000)
  }

  const handleDelete = (identifier, name) => {
    if (confirmation(name)) {
      //delete entry
      contactService
      .del(identifier)
      .then(() => {
        //delete entry from state array
        setPersons(persons.filter(x => x.id !== identifier))
        setNotification([`'${name}' deleted.`, false])
        vanish()
      })
      .catch(error => {
        console.log(error)
        setNotification([`failed to delete '${name}'.`, true])
        vanish()
      })
    }
  }
  
  return (
    props.personsToShow.map(object => <div key={object.id}>
      {object.name} {object.number}
      <button onClick={() => handleDelete(object.id, object.name)}>delete</button>
    </div>)
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ showAll, setShowAll ] = useState(true)
  const [ search, setSearch ] = useState('')
  const [ notification, setNotification ] = useState([null, false])

  //fetch data from server db.json
  const hook = () => {
    contactService
      .getAll()
      .then(updatedAll => {
        setPersons(updatedAll)
      })
  }
  useEffect(hook, [])

  //personstoshow is the whole array if showall is true, and filtered otherwise
  const personsToShow = showAll? persons
  : persons.filter(person => person.name.toLowerCase().includes(search))
  

  return (
    <div>
      <Notification arr={notification} />
      <h2>Search</h2>
      <Searchbox setShowAll={setShowAll} search={search} setSearch={setSearch}/>
      <h2>Add a new contact</h2>
      <PersonForm persons={persons} setPersons={setPersons} setNotification={setNotification}/>
      <h2>Numbers</h2>
      <Namelist personsToShow={personsToShow} persons={persons} setPersons={setPersons} setNotification={setNotification}/>
    </div>
  )
}

export default App