import React from "react";

const Note = ({ note, toggleImp }) => {
  const label = note.important ? "Make not important" : "Make important";
  return (
    <li>
      {note.content}
      <button onClick={toggleImp}>{label}</button>
    </li>
  );
};

export default Note;
