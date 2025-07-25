const express = require("express");
const router = express.Router();
const hotelController = require("../../controller/hotelController");
//hot hotel
router.get("/hot/:number", hotelController.getHotHotels);
//lấy ảnh của hotels dựa trên hotels_id
router.get("/:id/images", hotelController.getHotelImages);

//lấy room dữa trên hotel_id
router.get("/:id/rooms", hotelController.getHotelRooms);

//lấy room có giá thấp nhất
router.get("/:id/bestPrice", hotelController.getHotelBestPrice);


router.get("/", hotelController.getHotels);
router.get("/:slug", hotelController.getHotelById);
router.post("/", hotelController.createHotel);
router.put("/:id", hotelController.updateHotel);
router.delete("/:slug", hotelController.deleteHotel);

module.exports = router;
