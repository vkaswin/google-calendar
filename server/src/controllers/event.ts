import mongoose from "mongoose";
import Event from "../models/event";
import { EventSchema } from "../schema/event";
import { asyncHandler } from "../utils/asyncHandler";

const createEvent = asyncHandler(async (req, res) => {
  let body = EventSchema.parse(req.body);
  body.userId = req.user._id;
  let data = await Event.create(body);
  res
    .status(200)
    .send({ data, message: "Event has been created successfully" });
});

let deleteEvent = asyncHandler(async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Event has been deleted successfully" });
});

let updateEvent = asyncHandler(async (req, res) => {
  let body = EventSchema.parse(req.body);
  let data = await Event.findByIdAndUpdate(req.params.id, body);
  res
    .status(200)
    .send({ data, message: "Event has been updated successfully" });
});

let getEventByDate = asyncHandler(async (req, res) => {
  let { user, query } = req;

  let userId = new mongoose.Types.ObjectId(user._id);
  let startDate = new Date(query.startDate as string);
  let endDate = new Date(query.endDate as string);

  let data = await Event.aggregate([
    {
      $match: {
        userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          date: "$date",
          time: "$time",
        },
        events: {
          $push: {
            _id: "$_id",
            title: "$title",
            time: "$time",
            date: "$date",
            description: "$description",
            completed: "$completed",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateToString: {
            date: "$_id.date",
            format: "%G-%m-%d",
          },
        },
        time: "$_id.time",
        events: "$events",
      },
    },
  ]);

  res.status(200).send({ data, message: "Success" });
});

export { createEvent, updateEvent, deleteEvent, getEventByDate };
