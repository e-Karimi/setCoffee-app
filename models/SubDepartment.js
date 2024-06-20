import mongoose, { Schema } from "mongoose";
require("./Department");

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
});

const model = mongoose?.models?.SubDepartment || mongoose.model("SubDepartment", schema);

export default model;
