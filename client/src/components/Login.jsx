import React from "react";

function Login() {
  return (
    <div className="loginPage">
      <h1>Login</h1>
      <form>
        <input type="text" placeholder="Username" className="userInput" />
        <input type="password" placeholder="Password" className="userInput" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
