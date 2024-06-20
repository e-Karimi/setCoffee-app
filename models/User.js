import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: { type: String, default: "کاربر ست کافی" },
  phone: { type: String, required: true },
  password: { type: String, required: false },
  email: { type: String, required: false },
  role: { type: String, default: "USER" },
  isBanned: { type: Boolean, default: false },
  refreshToken: String,
});

const model = mongoose?.models?.User || mongoose.model("User", schema);

export default model;
