import React, { useState, useEffect } from "react";
import Home from "./Home";
import Todo from "./Todo";
import Login from "./Login";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
