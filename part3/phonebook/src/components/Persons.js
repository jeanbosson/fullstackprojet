import React from "react";

const Persons = (props) => {
  return (
    <div>
      {props.filteredPersons.map((persons) => (
        <p key={persons.name} className="person">
          {persons.name} {persons.number}
          <button onClick={() => props.handleDelete(persons.id)}>Delete</button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
