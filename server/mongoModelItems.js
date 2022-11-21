const mongoose = require("mongoose");

const schema = mongoose.Schema({ username: String, content: String });

mongoModelItems = mongoose.model("Items", schema);
module.exports = mongoModelItems;
