import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "UserId is required to create an event"],
      ref: "User",
      index: true,
    },
    title: {
      type: String,
    },
    date: {
      type: String,
    },
    description: {
      type: String,
    },
    time: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
