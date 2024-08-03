import { authenticate } from "./../middleware/auth";
import { Router } from "express";
import { createBooking, verifyBooking } from "../controller/booking";
import { viewBookings } from "../controller/booking";

const bookingRouter = Router();

bookingRouter.post("/", authenticate, createBooking);
bookingRouter.get("/", authenticate, viewBookings);
bookingRouter.put("/:id", authenticate, verifyBooking);

export default bookingRouter;
