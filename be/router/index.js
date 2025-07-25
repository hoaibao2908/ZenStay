// const amenityRouter = require("./amenity/index");
// const bookingRouter = require("./booking");
const hotelRouter = require("./hotel/hotels");
const hotelType = require("./hotel/hotelType");
// const imageRouter = require("./image");
// const roomRouter = require("./room");
const userRouter = require("./user");

// const reviewRouter = require("./review");
// const wardRouter = require("./ward");
// const paymentRouter = require("./payment");
// const promotionRouter = require("./promotion");
// const lateCheckoutRateRouter = require("./lateCheckoutRate");

function router(app) {
  // app.use("/amenities", amenityRouter);

  // app.use("/bookings", bookingRouter);

  app.use("/api/hotels", hotelRouter);
  app.use("/api/hotel-types", hotelType);
  // app.use("/images", imageRouter);

  // app.use("/rooms", roomRouter);

  app.use("/api/users", userRouter);

  // app.use("/reviews", reviewRouter);
  // app.use("/wards", wardRouter);
  // app.use("/payments", paymentRouter);
  // app.use("/promotions", promotionRouter);
  // app.use("/lateCheckoutRates", lateCheckoutRateRouter);
}

module.exports = router;
