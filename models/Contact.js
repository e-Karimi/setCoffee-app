import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  company: { type: String, required: false },
});

const model = mongoose?.models?.Contact || mongoose.model("Contact", schema);

export default model;
