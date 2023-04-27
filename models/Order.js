const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    requestedBy: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    items: {
      type: [],
      required: true,
    },
    submited: {
      type: Boolean,
      default: false,
    },
    submitedBy: {
      type: String,
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("order", orderSchema);

module.exports = Order;
