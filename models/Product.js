import mongoose, { Schema } from "mongoose";
require("./Comment");

const schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  weight: { type: Number, required: true },
  stock: { type: Number, required: true },
  smell: { type: String, required: true },
  suitableFor: { type: String, required: true },
  score: { type: Number, default: 5 },
  img: { type: String, required: true },
  tags: { type: [String], required: true },
});

schema.virtual("comments", {
  localField: "_id",
  foreignField: "productID",
  ref: "Comment",
});

const model = mongoose?.models?.Product || mongoose.model("Product", schema);

export default model;
