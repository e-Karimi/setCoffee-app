import mongoose, { Schema } from "mongoose";
require("./Product");
require("./User");

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  body: { type: String, required: true },
  score: { type: Number, default: 5 },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    immutable: false,
    default: () => Date.now(),
  },
  isAccepted: { type: Boolean, default: false },
  answerTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: false,
  },
  hasAnswer: {
    type: Boolean,
    default: false,
  },
});

const model = mongoose?.models?.Comment || mongoose.model("Comment", schema);

export default model;
