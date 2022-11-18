import React from "react";
import { useState } from "react";

function NewCard({ addCard }) {
  const [item, setItem] = useState("");
  function handleSubmit(e) {
    addCard(item);
    e.preventDefault();
    setItem("");
  }

  return (
    <div className="newCard">
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          placeholder="Take a note"
          cols="50"
          value={item}
          onChange={(evt) => setItem(evt.target.value)}
        ></textarea>
        <button type="submit" value="Submit" className="formBtn">
          <h1>+</h1>
        </button>
      </form>
    </div>
  );
}

export default NewCard;
