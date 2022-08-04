const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true, unique: true },
    fastName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    password: { type: String },
    photo: { type: String },
    createDate: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

const userModel = mongoose.model("users", DataSchema);
module.exports = userModel;
