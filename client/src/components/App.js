import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import NewCard from "./newCard";
import axios from "axios";

function getCard(txt, id, removeCard) {
  return <Card key="id" id={id} txt={txt} removeCard={removeCard} />;
}

function App() {
  const [allCards, setAllCards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3001");
      setAllCards(res);
    }
    fetchData();
  }, []);

  function addCard(newCard) {
    setAllCards([...allCards, newCard]);
  }

  function removeCard(id) {
    setAllCards(
      allCards.filter(function (element, index) {
        if (index !== id) {
          return element;
        }
      })
    );
  }

  return (
    <div>
      <Header></Header>
      <div>
        <NewCard addCard={addCard}></NewCard>
      </div>
      {allCards.map(function (txt, id) {
        return getCard(txt, id, removeCard);
      })}
      <Footer></Footer>
    </div>
  );
}

export default App;
