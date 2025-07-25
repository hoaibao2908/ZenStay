const sequelize = require("../config/database");
const {
  amenityData,
  bookingData,
  bookingRoomData,
  hotelAmenityData,
  hotelImagesData,
  hotelData,
  hotelTypeData,
  imagesData,
  lateCheckoutRateData,
  paymentData,
  promotionData,
  reviewData,
  roomTypeData,
  roomTypeAmenityData,
  roomTypeImagesData,
  roomImagesData,
  roomData,
  userData,
  userTypeData,
  wardData,
} = require("./index");
const {
  Amenity,
  Booking,
  BookingRoom,
  HotelAmenity,
  HotelImage,
  Hotel,
  HotelType,
  Images,
  LateCheckoutRate,
  Payment,
  Promotion,
  Review,
  RoomType,
  RoomTypeAmenity,
  RoomTypeImage,
  RoomImage,
  Room,
  User,
  UserType,
  Ward,
} = require("../models");

async function checkAndAddData(Model, Data, tableName) {
  try {
    console.log(" đang đồng bộ hóa bảng wards với model");
    await Model.sync({ alter: true });
    console.log(
      '✅ Bảng "Ward" đã được đồng bộ hóa thành công! (Tạo mới nếu chưa có, hoặc cập nhật schema nếu có thay đổi)'
    );

    const existing = await Model.count();
    if (existing === 0) {
      await Model.bulkCreate(Data);
      console.log("✨ seeding dữ liệu thành công");
    } else {
      console.log(`⚠️ Bảng ${tableName} đã có dữ liệu `);
    }
  } catch (error) {
    console.error(
      `❌ Lỗi khi đồng bộ hóa hoặc seed dữ liệu cho bảng "${tableName}":`,
      error
    );
    throw error;
  }
}
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối đến cơ sở dữ liệu đã được thiết lập thành công.");
    //đồng bộ hóa bảng với models
    //user type
    await checkAndAddData(UserType, userTypeData, "user_types");
    //amenity
    await checkAndAddData(Amenity, amenityData, "amenities");
    //hoteltype
    await checkAndAddData(HotelType, hotelTypeData, "hotel_types");
    // WardModel
    await checkAndAddData(Ward, wardData, "wards");

    //images
    await checkAndAddData(Images, imagesData, "images");
    //users
    await checkAndAddData(User, userData, "users");

    //kiểm tra bảng hotel
    await checkAndAddData(Hotel, hotelData, "hotels");

    //roomtype
    await checkAndAddData(RoomType, roomTypeData, "room_types");
    //hotel images
    await checkAndAddData(HotelImage, hotelImagesData, "hotel_images");
    //roomtype images
    await checkAndAddData(
      RoomTypeImage,
      roomTypeImagesData,
      "room_type_images"
    );
    //room Type Amenity
    await checkAndAddData(
      RoomTypeAmenity,
      roomTypeAmenityData,
      "room_type_amenities"
    );
    //hotel amenity
    await checkAndAddData(HotelAmenity, hotelAmenityData, "hotel_amenities");
    //rooms
    await checkAndAddData(Room, roomData, "rooms");
    //room images
    await checkAndAddData(RoomImage, roomImagesData, "room_images");

    //booking
    await checkAndAddData(Booking, bookingData, "bookings");

    //late checkout
    await checkAndAddData(
      LateCheckoutRate,
      lateCheckoutRateData,
      "late_checkout_rates"
    );
    //promotion- khuyến mãi
    await checkAndAddData(Promotion, promotionData, "promotions");
    //booking room
    await checkAndAddData(BookingRoom, bookingRoomData, "booking_rooms");
    //payment
    await checkAndAddData(Payment, paymentData, "payments");
    //review
    await checkAndAddData(Review, reviewData, "reviews");
  } catch (err) {
    console.error("❌ Lỗi khi thực hiện seed hoặc đồng bộ hóa:", err);
    if (err.name === "SequelizeConnectionRefusedError") {
      console.error(
        "Kiểm tra: Đảm bảo máy chủ MySQL của bạn đang chạy và thông tin kết nối (host, port, user, password) trong database.js là chính xác."
      );
    } else if (err.name === "SequelizeForeignKeyConstraintError") {
      console.error(
        "Lỗi khóa ngoại: Đảm bảo dữ liệu trong hotels_seed_data.json có owner_user_id và ward_id hợp lệ tồn tại trong bảng users và wards."
      );
    } else if (err.name === "SequelizeUniqueConstraintError") {
      console.error(
        "Lỗi trùng lặp: Đảm bảo trường slug trong hotels_seed_data.json là duy nhất."
      );
    }
  } finally {
    // Đóng kết nối sau khi hoàn thành hoặc gặp lỗi
    await sequelize.close();
    console.log("🔗 Kết nối cơ sở dữ liệu đã đóng.");
  }
})();
