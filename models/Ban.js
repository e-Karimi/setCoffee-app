import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    email: { type: String, required: false },
    phone: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const model = mongoose?.models?.Ban || mongoose.model("Ban", schema);

export default model;
