import Event from "../models/event";
import { asyncHandler } from "../utils/asyncHandler";
import { EventSchema } from "../schema/event";

const createEvent = asyncHandler(async (req, res) => {
  let body = EventSchema.parse(req.body);
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

export { createEvent, updateEvent, deleteEvent };
