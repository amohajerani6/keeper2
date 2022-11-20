import React from "react";
import Register from "./Register";
import Todo from "./Todo";
import Login from "./Login";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/registration" element={<Register />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
