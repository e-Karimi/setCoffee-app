import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  code: { type: String, required: true },
  phone: { type: String, required: true },
  expTime: { type: Number, required: true },
  times: { type: Number, default: 0 },
});

const model = mongoose?.models?.Otp || mongoose.model("Otp", schema);

export default model;
