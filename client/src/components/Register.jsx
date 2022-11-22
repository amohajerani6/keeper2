import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  var token = localStorage.getItem("token");
  const navigate = useNavigate();
  // If already has a token, go to the todo list
  useEffect(() => {
    if (token) {
     // navigate("/todo");
    }
  }, []);
  const [loginData, setLoginData] = useState({
    name: "",
    username: "",
    password: "",
  });

  function onChangeFunc(event) {
    if (event.target.name === "username") {
      setLoginData({
        name: loginData.name,
        username: event.target.value,
        password: loginData.password,
      });
    } else if (event.target.name === "name") {
      setLoginData({
        name: event.target.value,
        username: loginData.username,
        password: loginData.password,
      });
    } else {
      setLoginData({
        name: loginData.name,
        username: loginData.username,
        password: event.target.value,
      });
    }
  }

  function handleRegistration(event) {
    // send the data to the server for authentication
    console.log("data being sent for registration: ", loginData);
    axios
      .post("http://localhost:3001/register", loginData)
      .then(function (response) {
        if (response.data.registered) {
          navigate("/");
        } else {
          alert("try again");
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    event.preventDefault();
  }

  return (
    <>
      <div className="loginPage">
        <h1>Registration</h1>
        <form onSubmit={handleRegistration}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="userInput"
            onChange={onChangeFunc}
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="userInput"
            onChange={onChangeFunc}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="userInput"
            onChange={onChangeFunc}
          />
          <button type="submit">Submit</button>
        </form>
        <p>Already have an account? </p>
        <Link to="/">Sign in</Link>
      </div>
    </>
  );
}

export default Register;
