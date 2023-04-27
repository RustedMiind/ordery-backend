const mongoose = require("mongoose");

const adminTokenScema = mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
  },
});

const AdminToken = mongoose.model("adminToken", adminTokenScema);

module.exports = AdminToken;
