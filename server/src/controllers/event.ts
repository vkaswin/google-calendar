import mongoose from "mongoose";
import Event from "../models/event";
import { EventSchema } from "../schema/event";
import { asyncHandler } from "../utils/asyncHandler";
import { getPagination } from "../utils";

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
  let { body, params } = req;
  let data = await Event.findByIdAndUpdate(params.id, body);
  res
    .status(200)
    .send({ data, message: "Event has been updated successfully" });
});

let getEventByDate = asyncHandler(async (req, res) => {
  let {
    user,
    query: { startDate, endDate, type },
  } = req;

  let userId = new mongoose.Types.ObjectId(user._id);

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
      $sort: {
        date: 1,
        time: 1,
      },
    },
    ...(type !== "year"
      ? [
          {
            $group: {
              _id: {
                date: "$date",
                ...(type !== "month" ? { time: "$time" } : {}),
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
          ...(type !== "year"
            ? [
                {
                  $project: {
                    _id: 0,
                    date: "$_id.date",
                    time: "$_id.time",
                    events: "$events",
                  },
                },
              ]
            : []),
        ]
      : []),
  ]);

  res.status(200).send({ data, message: "Success" });
});

let searchEvents = asyncHandler(async (req, res) => {
  let {
    query: { search, limit = 25, page = 1 },
    user,
  } = req;

  limit = +limit;
  page = +page;

  let query = {
    userId: user._id,
    title: { $regex: search, $options: "i" },
  };

  let total = await Event.find(query).countDocuments();

  let list = await Event.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  let data = getPagination({ list, limit, page, total });

  res.status(200).send({ data, message: "Success" });
});

export { createEvent, updateEvent, deleteEvent, getEventByDate, searchEvents };
