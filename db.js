const mongoose = require("mongoose");

const dbURI = "mongodb://127.0.0.1:27017/restaurant_MERN";
const connectDB = (cb) => {
  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((result) => cb())
    .catch((err) => cb(err));
};

module.exports = connectDB;
