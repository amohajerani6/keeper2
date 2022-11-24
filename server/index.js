const express = require("express");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
const mongoModelItems = require("./mongoModelItems");
const mongoModelAccounts = require("./mongoModelAccounts");
app.use(express.json());

const dbLink = process.env.dbLink;

mongoose.connect(dbLink + "/keeper?retryWrites=true&w=majority", {
  useNewUrlParser: true,
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    console.log("req.headers,  ", req.headers);
    const token = authHeader.split(" ")[1];
    console.log("the token is: ", token);

    jwt.verify(token, process.env.TOKENSECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      console.log("username from the token", user.username);
      req.username = user.username;
      req.name = user.name;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

app.get("/todo", verify, async function (req, res) {
  try {
    var queryResults = await mongoModelItems.find({ username: req.username });
    res.send(JSON.stringify(queryResults));
  } catch (err) {
    console.log("error in adding data", err);
  }
});

app.post("/todo", verify, async function (req, res) {
  console.log("request came in");
  var content = req.content;
  var username = req.username;
  var newItem = new mongoModelItems({
    username: username,
    content: content,
  });
  await newItem.save();
});
let refreshTokens = [];

function generateToken(name, username) {
  console.log("name", name);
  console.log("username", username);
  // Token expiry in 15 seconds
  var token = jwt.sign(
    { name: name, username: username, exp: Math.floor(Date.now() / 1000) + 20 },
    process.env.TOKENSECRET
  );
  return token;
}

function generateRefreshToken(name, username) {
  console.log("name", name);
  console.log("username", username);
  var token = jwt.sign(
    {
      name: name,
      username: username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
    },
    process.env.REFRESHTOKENSECRET
  );
  refreshTokens.push(token);
  return token;
}

app.post("/login", async function (req, res) {
  console.log("post request received");
  // verify and send token
  //Check if the username exists and the password matches
  async function findUser(username, password) {
    var dbAccount = await mongoModelAccounts.findOne({
      username: username,
    });
    console.log("dbAccount", dbAccount);
    if (dbAccount) {
      // Check if the password is correct
      bcrypt.compare(password, dbAccount.password, function (err, result) {
        if (result) {
          console.log("Account verified");
          var token = generateToken(dbAccount.name, dbAccount.username);
          var refreshToken = generateRefreshToken(
            dbAccount.name,
            dbAccount.username
          );
          res.json({
            name: dbAccount.name,
            username: dbAccount.username,
            token: token,
            refreshToken: refreshToken,
          });
        } else {
          console.log("Wrong password");
        }
      });
    } else console.log("Wrong credentials");
  }
  findUser(req.body.username, req.body.password);
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, 5, function (err, hash) {
    // add to the db
    var newAccount = new mongoModelAccounts({
      name: req.body.name,
      username: req.body.username,
      password: hash,
    });
    try {
      newAccount.save();
      res.json({ registered: true });
    } catch (err) {
      console.log("error in adding new user", err);
    }
  });
});

app.post("/logout", verify, function (req, res) {
  var refreshToken = req.refreshToken;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  console.log("logged out");
});

app.post("/refresh", (req, res) => {
  console.log("refresh request here");
  console.log("refresh tokens: ", refreshTokens);

  //take the refresh token from the user
  const refreshToken = req.body.refreshToken;
  console.log("refresh token: ", refreshToken);
  console.log("includes ", refreshTokens.includes(refreshToken));
  //send error if there is no token or it's invalid
  if (!refreshToken) {
    console.log("401 error here");
    return res.status(401).json("You are not authenticated!");
  }
  if (!refreshTokens.includes(refreshToken)) {
    console.log("403 error here");
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, process.env.REFRESHTOKENSECRET, (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateToken(user.name, user.username);
    const newRefreshToken = generateRefreshToken(user.name, user.username);

    res.status(200).json({
      name: user.name,
      username: user.username,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
});

app.listen(3001, console.log("server running on port 3001"));
