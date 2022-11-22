import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import NewCard from "./newCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GetRefreshToken from "./RefreshAuth";
import jwt_decode from "jwt-decode";


function getCard(content, id, removeCard) {
  return <Card key={id} id={id} txt={content} removeCard={removeCard} />;
}

function Todo() {
  var userInfo = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, []);

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use( async (config) => {
    let currentDate = new Date();
    const decodedToken = jwt_decode(userInfo.token);
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      const data = await GetRefreshToken(userInfo.refreshToken);
      config.headers["authorization"] = "Bearer " + data.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

  const [allCards, setAllCards] = useState([]);
  var name = userInfo.name;
  useEffect(() => {
    async function fetchData() {
      const res = await axiosJWT.get("http://localhost:3001/todo", {
        headers: { authorization: "Bearer " + userInfo.token },
      });
      setAllCards(res.data);
    }
    fetchData();
  }, []);

  function addCard(content) {
    // Add the new card to the db
    async function postData(content) {
      var userInfo = JSON.parse(localStorage.getItem("token"));
      await axiosJWT.post(
        "http://localhost:3001/todo",
        {
          username: userInfo.username,
          content: content,
        },
        {
          headers: { authorization: "Bearer " + userInfo.token },
        }
      );
    }
    postData(content);
    // Add the new card to the UI
    setAllCards([...allCards, { content: content }]);
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

  function LogOutAction(e) {
    localStorage.removeItem("token");

    navigate("/");
    //e.preventDefault();
  }

  return (
    <>
      <div>
        <Header></Header>
        <h1>Welcome {name}</h1>
        <form onSubmit={LogOutAction} className="logOutbutton">
          <button type="submit">Log out</button>
        </form>

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
