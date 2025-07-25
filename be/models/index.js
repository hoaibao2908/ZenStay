// Import all models
const UserType = require("./UserTypesModel");
const User = require("./UserModel");
const Ward = require("./WardModel");
const Images = require("./ImageModel");
const HotelType = require("./HotelTypesModel");
const Hotel = require("./HotelModel");
const HotelImage = require("./HotelImageModel");
const RoomType = require("./RoomTypesModel");
const RoomTypeImage = require("./RoomTypeImagesModel");
const Room = require("./RoomsModels");
const RoomImage = require("./RoomImagesModel");
const Amenity = require("./AmenityModel");
const HotelAmenity = require("./HotelAmenityModel");
const RoomTypeAmenity = require("./RoomTypeAmenityModel");
const Booking = require("./BookingsModel");
const BookingRoom = require("./BookingRoomsModel");
const Payment = require("./PaymentModel");
const LateCheckoutRate = require("./LateCheckoutRatesModel");
const Promotion = require("./PromotionModel");
const Review = require("./ReviewModel");


// Define Associations

// User and UserType (1:N)
UserType.hasMany(User, { foreignKey: "user_type_id", as: "users" });
User.belongsTo(UserType, { foreignKey: "user_type_id", as: "userType" });

// Hotel and User (Owner) (1:N)
User.hasMany(Hotel, { foreignKey: "owner_user_id", as: "ownedHotels" });
Hotel.belongsTo(User, { foreignKey: "owner_user_id", as: "owner" });

// Hotel and Ward (1:N)
Ward.hasMany(Hotel, { foreignKey: "ward_id", as: "hotels" });
Hotel.belongsTo(Ward, { foreignKey: "ward_id", as: "ward" });

// Hotel and HotelType (1:N)
HotelType.hasMany(Hotel, { foreignKey: "hotel_type_id", as: "hotels" });
Hotel.belongsTo(HotelType, { foreignKey: "hotel_type_id", as: "hotelType" });

// Hotel and Image (M:N through HotelImage)
Hotel.belongsToMany(Images, {
  through: HotelImage,
  foreignKey: "hotel_id",
  otherKey: "image_id",
  as: "images",
});
Images.belongsToMany(Hotel, {
  through: HotelImage,
  foreignKey: "image_id",
  otherKey: "hotel_id",
  as: "hotels",
});
Hotel.hasMany(HotelImage, { foreignKey: "hotel_id", as: "hotelImages" }); // Direct access to join table
HotelImage.belongsTo(Hotel, { foreignKey: "hotel_id" });
Images.hasMany(HotelImage, { foreignKey: "image_id", as: "imageHotels" }); // Direct access to join table
HotelImage.belongsTo(Images, { foreignKey: "image_id" });

// RoomType and Image (M:N through RoomTypeImage)
RoomType.belongsToMany(Images, {
  through: RoomTypeImage,
  foreignKey: "room_type_id",
  otherKey: "image_id",
  as: "images",
});
Images.belongsToMany(RoomType, {
  through: RoomTypeImage,
  foreignKey: "image_id",
  otherKey: "room_type_id",
  as: "roomTypes",
});
RoomType.hasMany(RoomTypeImage, {
  foreignKey: "room_type_id",
  as: "roomTypeImages",
});
RoomTypeImage.belongsTo(RoomType, { foreignKey: "room_type_id" });
Images.hasMany(RoomTypeImage, { foreignKey: "image_id", as: "roomTypeImages" });
RoomTypeImage.belongsTo(Images, { foreignKey: "image_id" });

// Room and Image (M:N through RoomImage)
Room.belongsToMany(Images, {
  through: RoomImage,
  foreignKey: "room_id",
  otherKey: "image_id",
  as: "images",
});
Images.belongsToMany(Room, {
  through: RoomImage,
  foreignKey: "image_id",
  otherKey: "room_id",
  as: "rooms",
});
Room.hasMany(RoomImage, { foreignKey: "room_id", as: "roomImages" });
RoomImage.belongsTo(Room, { foreignKey: "room_id" });
Images.hasMany(RoomImage, { foreignKey: "image_id", as: "roomImages" });
RoomImage.belongsTo(Images, { foreignKey: "image_id" });

// Room and Hotel (1:N)
Hotel.hasMany(Room, { foreignKey: "hotel_id", as: "rooms" });
Room.belongsTo(Hotel, { foreignKey: "hotel_id", as: "hotel" });

// Room and RoomType (1:N)
RoomType.hasMany(Room, { foreignKey: "room_type_id", as: "rooms" });
Room.belongsTo(RoomType, { foreignKey: "room_type_id", as: "roomType" });

// Hotel and Amenity (M:N through HotelAmenity)
Hotel.belongsToMany(Amenity, {
  through: HotelAmenity,
  foreignKey: "hotel_id",
  otherKey: "amenities_id",
  as: "amenities",
});
Amenity.belongsToMany(Hotel, {
  through: HotelAmenity,
  foreignKey: "amenities_id",
  otherKey: "hotel_id",
  as: "hotels",
});
Hotel.hasMany(HotelAmenity, { foreignKey: "hotel_id", as: "hotelAmenities" });
HotelAmenity.belongsTo(Hotel, { foreignKey: "hotel_id" });
Amenity.hasMany(HotelAmenity, {
  foreignKey: "amenities_id",
  as: "amenityHotels",
});
HotelAmenity.belongsTo(Amenity, { foreignKey: "amenities_id" });

// RoomType and Amenity (M:N through RoomTypeAmenity)
RoomType.belongsToMany(Amenity, {
  through: RoomTypeAmenity,
  foreignKey: "room_type_id",
  otherKey: "amenities_id",
  as: "amenities",
});
Amenity.belongsToMany(RoomType, {
  through: RoomTypeAmenity,
  foreignKey: "amenities_id",
  otherKey: "room_type_id",
  as: "roomTypes",
});
RoomType.hasMany(RoomTypeAmenity, {
  foreignKey: "room_type_id",
  as: "roomTypeAmenities",
});
RoomTypeAmenity.belongsTo(RoomType, { foreignKey: "room_type_id" });
Amenity.hasMany(RoomTypeAmenity, {
  foreignKey: "amenities_id",
  as: "amenityRoomTypes",
});
RoomTypeAmenity.belongsTo(Amenity, { foreignKey: "amenities_id" });

// Booking and User (Customer) (1:N)
User.hasMany(Booking, { foreignKey: "customer_user_id", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "customer_user_id", as: "customer" });

// Booking and Room (M:N through BookingRoom)
Booking.belongsToMany(Room, {
  through: BookingRoom,
  foreignKey: "booking_id",
  otherKey: "room_id",
  as: "rooms",
});
Room.belongsToMany(Booking, {
  through: BookingRoom,
  foreignKey: "room_id",
  otherKey: "booking_id",
  as: "bookings",
});
Booking.hasMany(BookingRoom, { foreignKey: "booking_id", as: "bookingRooms" }); // Direct access to join table
BookingRoom.belongsTo(Booking, { foreignKey: "booking_id" });
Room.hasMany(BookingRoom, { foreignKey: "room_id", as: "roomBookings" }); // Direct access to join table
BookingRoom.belongsTo(Room, { foreignKey: "room_id" });

// Payment and Booking (1:N)
Booking.hasMany(Payment, { foreignKey: "booking_id", as: "payments" });
Payment.belongsTo(Booking, { foreignKey: "booking_id", as: "booking" });

// LateCheckoutRate and Hotel (1:N)
Hotel.hasMany(LateCheckoutRate, {
  foreignKey: "hotel_id",
  as: "lateCheckoutRates",
});
LateCheckoutRate.belongsTo(Hotel, { foreignKey: "hotel_id", as: "hotel" });

// Promotion relationships (can be applied to hotel or room type or neither)
Hotel.hasMany(Promotion, { foreignKey: "hotel_id", as: "promotions" });
Promotion.belongsTo(Hotel, { foreignKey: "hotel_id", as: "hotel" });
RoomType.hasMany(Promotion, { foreignKey: "room_type_id", as: "promotions" });
Promotion.belongsTo(RoomType, { foreignKey: "room_type_id", as: "roomType" });

// Review and Hotel (1:N)
Hotel.hasMany(Review, { foreignKey: "hotel_id", as: "reviews" });
Review.belongsTo(Hotel, { foreignKey: "hotel_id", as: "hotel" });

// Review and User (Customer) (1:N)
User.hasMany(Review, { foreignKey: "customer_id", as: "reviews" });
Review.belongsTo(User, { foreignKey: "customer_id", as: "customer" });

// Export all models
module.exports = {
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
};
