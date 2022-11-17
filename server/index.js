const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
const mongoModelItems = require("./mongoModelItems");
//app.use(express.json)
mongoose.connect(
  "mongodb+srv://amohajerani6:KpzxlEtnT8wlscCN@cluster0.piaytyc.mongodb.net/keeper?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

app.get("/", async function (req, res) {
  var newItem = new mongoModelItems({
    content: "test",
  });
  try {
    await newItem.save();
    res.send(
      "['This is my first note','This is my second note','This is my third note']"
    );
  } catch (err) {
    console.log("error in adding data", err);
  }
});

app.listen(3001, console.log("server running on port 3001"));
