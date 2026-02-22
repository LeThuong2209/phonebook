import { useState, useEffect, use } from "react";
import noteServices from './services/notes';
import Notification from "./components/Notification";
import './index.css'

const Person = (props) => {
  return ( 
    <ol>
      {props.persons.map(person => 
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => props.handleDelete(person.id, person.name)}>
            delete
          </button>
        </li>)}
    </ol>
  )
}

const Filter = (props) => {
  return (
    <div>
      <h2>Filter shown with
        <input  
          value={props.searchTerm}
          onChange={props.handleSearchChange}
        />
      </h2>
      {props.searchTerm !== '' && (
        <Person persons={props.filteredPersons} handleDelete={props.handleDelete}/>
      )}
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
          name: 
          <input
            value={props.newName}
            onChange={props.handleNameChange}
          />
        </div>
        <div>
          number:
          <input 
            value={props.newPhone}
            onChange={props.handlePhoneChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setsearchTerm] = useState('')
  const [noti, setNoti] = useState(null)

  useEffect(() => {
    noteServices
      .getAllNotes()
      .then((returnedNote) => {
        setPersons(returnedNote)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (newName === '' || newPhone === ''){
      alert("Please filling all blanks")
      return
    }

    const personObj = {
      name: newName,
      id: String(persons.length + 1),
      number: newPhone
    }

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson){
      const confirmUpdate = window.confirm(`${newName} has already existed. Replace the old number?`)
      if (confirmUpdate === false){
        return
      }

      const updatePerson = {...existingPerson, number: newPhone}

      noteServices
        .update(updatePerson.id, updatePerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => {
            return person.id !== returnedPerson.id ? person : returnedPerson
          }))
          setNewName('')
          setNewPhone('')
          
          setNoti(`Successfully modifying ${returnedPerson.name} to list`)
          
          setTimeout(() => {
            setNoti(null)
          }, 5000)

        })
        .catch(error => {
          setNoti(`Information of ${personObj.name} has already removed from server`)

          setTimeout(() => {
            setNoti(null)
          }, 5000)
        })
      return
    }

    noteServices 
      .create(personObj)
      .then(returnedNote => {
        setPersons(persons.concat(returnedNote))
        setNewName('')

        setNoti(`Successfully adding ${personObj.name} to your list...`)
        setTimeout(() => {
          setNoti(null)
        }, 5000)
      })
      .catch(error => {
        setNoti(`Cannot add ${personObj.name} to your list`)

        setTimeout(() => {
          setNoti(null)
        }, 5000)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleSearchChange = (event) => {
    setsearchTerm(event.target.value)
  }

  const filteredPersons = searchTerm === '' ? [] : persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`You want to delete ${name}?`)
    if (!confirmDelete) {
      return
    }

    noteServices
      .removePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter 
        searchTerm={searchTerm} 
        handleSearchChange={handleSearchChange} 
        filteredPersons={filteredPersons} 
        handleDelete={handleDelete}
      />
      <h2>Add a new phone</h2>
      <Notification messages={noti}/>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newPhone={newPhone} 
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      <Person persons={persons} handleDelete={handleDelete}/>
    </div>
  )
}

export default App