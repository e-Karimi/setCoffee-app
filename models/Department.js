import mongoose, { Schema } from "mongoose";


const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const model = mongoose?.models?.Department || mongoose.model("Department", schema);

export default model;
