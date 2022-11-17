const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
//app.use(bodyParser.urlencoded({ extended: true }));
const mongoModelItems = require("./mongoModelItems");
app.use(express.json());
mongoose.connect(
  "mongodb+srv://amohajerani6:KpzxlEtnT8wlscCN@cluster0.piaytyc.mongodb.net/keeper?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

app.get("/", async function (req, res) {
  try {
    var queryResults = await mongoModelItems.find({});
    res.send(JSON.stringify(queryResults));
  } catch (err) {
    console.log("error in adding data", err);
  }
});

app.post("/", async function (req, res) {
  console.log("req.body ", req.body);
  var content = req.body.content;
  var newItem = new mongoModelItems({
    content: content,
  });
  await newItem.save();
});

app.listen(3001, console.log("server running on port 3001"));
