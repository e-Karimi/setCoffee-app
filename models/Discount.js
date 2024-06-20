import mongoose, { Schema } from "mongoose";
require("./User");

const schema = new Schema(
  {
    code: { type: String, required: true },
    percent: { type: Number, required: true },
    expire: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose?.models?.Discount || mongoose.model("Discount", schema);

export default model;
