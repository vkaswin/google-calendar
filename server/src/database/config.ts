import mongoose from "mongoose";
import event from "../models/event";

const connect = async () => {
  mongoose.set("strictQuery", true);

  let uri = (
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI_DEV
      : process.env.MONGO_URI
  ) as string;

  let res = await mongoose.connect(uri);

  console.log(
    "🚀 ~ file: config.ts:17 ~ MongoDB connected ~ ",
    res.connection.host
  );
};

export default connect;
