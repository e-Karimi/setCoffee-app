import mongoose from "mongoose";

 const connectedToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    } else {
      await mongoose.connect(process.env.MONGO_URL);
      console.log(" connected To DB  Successfully :)");
    }
  } catch (err) {
    console.log("Error in connection To DB !! ~ err:", err);
  }
};


export default connectedToDB