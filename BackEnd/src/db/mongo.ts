import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL!);
    console.log("connection host: ", connect.connection.host);
  } catch (error) {
    console.error("connection to the DB: ", error);
    process.exit(0);
  }
};

export default connectionDB;
