import React from "react";

const Personform = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        <div>
          name:{" "}
          <input
            onChange={(event) => props.setNewName(event.target.value)}
            value={props.newName}
          />
        </div>
        <div>
          number:{" "}
          <input
            onChange={(event) => props.setNewNumber(event.target.value)}
            value={props.newNumber}
          />
        </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default Personform;
