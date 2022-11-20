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

app.get("/todo", async function (req, res) {
  try {
    var queryResults = await mongoModelItems.find({});
    res.send(JSON.stringify(queryResults));
  } catch (err) {
    console.log("error in adding data", err);
  }
});

app.post("/todo", async function (req, res) {
  var content = req.body.content;
  var newItem = new mongoModelItems({
    content: content,
  });
  await newItem.save();
});

function generateToken(username) {
  var token = jwt.sign({ username: username }, process.env.TOKENSECRET);
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
    if (dbAccount) {
      // Check if the password is correct
      bcrypt.compare(password, dbAccount.password, function (err, result) {
        if (result) {
          console.log("Account verified");
          var token = generateToken(username);
          res.json({ token: token });
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
