import React, { useState, useEffect } from "react";
import Axios from "axios";
import Filter from "./components/Filter";
import Personform from "./components/Personform";
import Persons from "./components/Persons";
import phoneService from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterString, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [notifMessage, setNotifMessage] = useState(null);

  const hook = () => {
    // Axios.get("http://localhost:3001/persons").then((response) => {
    //   console.log(response.data);

    //   setPersons(response.data);
    // });
    phoneService.getAll().then((personsDb) => setPersons(personsDb));
  };

  useEffect(hook, []);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const filteredPersons =
    filterString === ""
      ? persons
      : persons.filter((persons) =>
          //get the object keys of the current object and filter through it
          //with .some to return true if a match is found
          //check with .includes method if filterstring is found after converting both to lowercase
          Object.keys(persons).some(
            (prop) =>
              persons[prop]
                .toString()
                .toLowerCase()
                .includes(filterString.toLowerCase()) === true
          )
        );

  const addPerson = (event) => {
    event.preventDefault();
    const exists = persons.some((p) => p.name === newName);
    if (exists) {
      if (
        window.confirm(
          `${newName} is already in the phonebook! Want to replace the number with a new one?`
        )
      ) {
        const personObject = persons.find((person) => person.name === newName);
        const updatedPerson = { ...personObject, number: newNumber };
        phoneService
          .update(updatedPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== personObject.id ? person : response
              )
            );
          })
          .catch((error) => {
            setErrorMessage(
              `${personObject.name} was already removed from the server!`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter((n) => n.id !== personObject.id));
          });

        // phoneService.update(personObject)
      }
    } else if (newName === "" || newNumber === "") {
      alert("Please fill both fields!");
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      phoneService.create(personObject).then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setNotifMessage(`Added ${newPerson.name}`);
        setTimeout(() => {
          setNotifMessage(null);
        }, 5000);
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete entry?")) {
      phoneService.axiosDelete(id);
      setPersons(persons.filter((person) => person.id != id));
    }
  };

  const Notification = ({ message, cName }) => {
    if (message === null) {
      return null;
    }
    return <div className={cName}>{message}</div>;
  };

  return (
    <div>
      <Notification message={errorMessage} cName="error" />
      <Notification message={notifMessage} cName="notif" />
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} filterString={filterString}></Filter>
      <h2>Add New</h2>
      <Personform
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      ></Personform>
      <h2>Numbers</h2>
      <Persons
        filteredPersons={filteredPersons}
        handleDelete={handleDelete}
      ></Persons>
    </div>
  );
};

export default App;
