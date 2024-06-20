import mongoose, { Schema } from "mongoose";
require("./Product");
require("./User");

const schema = new Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose?.models?.Wishlist || mongoose.model("Wishlist", schema);

export default model;
