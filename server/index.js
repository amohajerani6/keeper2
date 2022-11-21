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
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.TOKENSECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      console.log("username from the token", user.username);
      req.username = user.username;
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
  var content = req.body.content;
  var username = req.username;
  var newItem = new mongoModelItems({
    username: username,
    content: content,
  });
  await newItem.save();
});

function generateToken(name, username) {
  console.log("name", name);
  console.log("username", username);
  var token = jwt.sign(
    { name: name, username: username },
    process.env.TOKENSECRET
  );
  console.log(token);
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
          res.json({
            name: dbAccount.name,
            username: dbAccount.username,
            token: token,
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

app.listen(3001, console.log("server running on port 3001"));
