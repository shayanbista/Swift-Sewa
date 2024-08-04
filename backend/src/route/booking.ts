import { authenticate } from "./../middleware/auth";
import { Router } from "express";
import { createBooking, verifyBooking } from "../controller/booking";
import { viewBookings } from "../controller/booking";
import { validateReqBody, validateReqParams } from "../middleware/validator";
import { bookingBodySchema, bookingIdSchema } from "../schema/booking";

const bookingRouter = Router();

bookingRouter.post(
  "/",
  authenticate,
  validateReqBody(bookingBodySchema),
  createBooking
);
bookingRouter.get("/", authenticate, viewBookings);

bookingRouter.put(
  "/:id",
  authenticate,
  validateReqParams(bookingIdSchema),
  verifyBooking
);

export default bookingRouter;
