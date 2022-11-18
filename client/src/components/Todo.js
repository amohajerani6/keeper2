import React, { useState, useEffect } from "react";
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";
import Card from "./Card";
import NewCard from "./newCard";
import axios from "axios";
import { Route, Routes } from "react-router-dom";

function getCard(content, id, removeCard) {
  return <Card key={id} id={id} txt={content} removeCard={removeCard} />;
}

function Todo() {
  const [allCards, setAllCards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3001/todo");
      setAllCards(res.data);
    }
    fetchData();
  }, []);

  function addCard(newCard) {
    // Add the new card to the db
    async function postData(newCard) {
      console.log("newCard", newCard);
      await axios.post("http://localhost:3001/todo", {
        content: newCard,
      });
    }
    postData(newCard);
    // Add the new card to the UI
    setAllCards([...allCards, { content: newCard }]);
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
    <>
      <div>
        <Header></Header>
        <div>
          <NewCard addCard={addCard}></NewCard>
        </div>
        {allCards.map(function (card, idx) {
          return getCard(card.content, idx, removeCard);
        })}
        <Footer></Footer>
      </div>
    </>
  );
}

export default Todo;
