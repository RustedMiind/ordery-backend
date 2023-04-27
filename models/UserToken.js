const mongoose = require("mongoose");

const userTokenScema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
});

const UserToken = mongoose.model("userToken", userTokenScema);

module.exports = UserToken;
