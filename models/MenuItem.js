const mongoose = require("mongoose");

const menuItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    categories: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Menu = mongoose.model("menuitem", menuItemSchema);

module.exports = Menu;
