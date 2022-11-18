import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="loginPage">
      <h1>Registration</h1>
      <form>
        <input type="text" placeholder="Username" className="userInput" />
        <input type="password" placeholder="Password" className="userInput" />
        <button type="submit">Submit</button>
      </form>
      <p>Already have an account? </p>
      <Link to="/login">Login</Link>
    </div>
  );
}

export default Home;
