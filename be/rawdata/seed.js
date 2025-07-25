const sequelize = require("../config/database");
const slugify = require("slugify");
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
} = require("./index"); // Đảm bảo đường dẫn này đúng tới file index.js chứa dữ liệu của bạn
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


function generateSlug(text) {
  return slugify(text, {
    lower: true,          // Chuyển đổi tất cả ký tự thành chữ thường
    strict: true,         // Loại bỏ các ký tự không được hỗ trợ bởi slug
    locale: 'vi',         // Hỗ trợ ký tự tiếng Việt (ví dụ: đ -> d)
    trim: true            // Cắt khoảng trắng ở đầu và cuối
  });
}

function getOrGenerateSlug(slug,name){
    const generatedSlugFromName = generateSlug(name);
     if (!slug || slug !== generatedSlugFromName) {
    console.log(`Slug "${slug}" không hợp lệ hoặc không khớp với tên "${name}". Tạo slug mới: "${generatedSlugFromName}"`);
    return generatedSlugFromName;
  }
  console.log(`Slug "${slug}" hợp lệ.`);
  return slug;
}

async function getOrCreateValidFK(Model, providedId, defaultCreator) {
  if (providedId) {
    const existing = await Model.findByPk(providedId);
    if (existing) {
      return existing.id;
    }
    console.warn(
      `  WARN: ID ${providedId} không tồn tại trong bảng "${Model.tableName}". Đang cố gắng tìm/tạo bản ghi mặc định.`
    );
  }

  // Nếu providedId không hợp lệ hoặc không được cung cấp, cố gắng tìm một bản ghi bất kỳ đang có
  const anyExisting = await Model.findOne();
  if (anyExisting) {
    console.warn(
      `  WARN: Không có ID được cung cấp. Đang cố gắng tìm bản ghi bất kỳ trong bảng với id"${anyExisting.id}".`
    );
    return anyExisting.id;
  }

  // Nếu không có bản ghi nào tồn tại, tạo một bản ghi mặc định mới
  const newDefault = await defaultCreator();
  console.log(
    `  INFO: Đã tạo bản ghi mặc định mới trong bảng "${Model.tableName}" với ID ${newDefault.id}.`
  );
  return newDefault.id;
}

// Hàm tạo các bản ghi mặc định (defaultCreator functions)
// Các hàm này được gọi khi không tìm thấy bản ghi cha hợp lệ nào
const defaultUserTypeCreator = () =>
  UserType.create({
    name: "Default User Type",
    slug: "default-user-type",
    is_active: true,
  });
const defaultWardCreator = () =>
  Ward.create({
    name: "Default Ward",
    district_id: 1,
    province_id: 1,
    is_active: true,
  });
const defaultHotelTypeCreator = () =>
  HotelType.create({
    name: "Default Hotel Type",
    slug: "default-hotel-type",
    description: "Default Hotel Type",
  });
const defaultAmenityCreator = () =>
  Amenity.create({ name: "Default Amenity", icon: "default-icon" });
const defaultImagesCreator = () =>
  Images.create({
    url: "http://example.com/default_image.jpg",
    alt_text: "Default Image",
  });

const defaultUserCreator = async () => {
  const userTypeId = await getOrCreateValidFK(
    UserType,
    null,
    defaultUserTypeCreator
  );
  return User.create({
    username: `default_user_${Date.now()}`,
    email: `default_user_${Date.now()}@example.com`,
    password: "hashedpassword_PLACEHOLDER", // Hãy đảm bảo mật khẩu được hash đúng cách trong ứng dụng thực tế
    full_name: "Default User",
    user_type_id: userTypeId,
    phone_number: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
    is_active: true,
    email_verified: true,
    last_login_at: new Date(),
  });
};

const defaultHotelCreator = async () => {
  const ownerUserId = await getOrCreateValidFK(User, null, defaultUserCreator);
  const wardId = await getOrCreateValidFK(Ward, null, defaultWardCreator);
  const hotelTypeId = await getOrCreateValidFK(
    HotelType,
    null,
    defaultHotelTypeCreator
  );
  return Hotel.create({
    owner_user_id: ownerUserId,
    name: `Default Hotel ${Date.now()}`,
    slug: `default-hotel-${Date.now()}`,
    description: "A dynamically created default hotel.",
    hotel_type_id: hotelTypeId,
    address: "Default Address",
    ward_id: wardId,
    latitude: 0.0,
    longitude: 0.0,
    star_rating: 3,
    contact_email: `info@default-hotel-${Date.now()}.com`,
    contact_phone: "0987654321",
    check_in_time: "14:00:00",
    check_out_time: "12:00:00",
    status: "approved",
    viewer: 0,
    hot: false,
  });
};

const defaultRoomTypeCreator = () => RoomType.create({
    name: `Default RoomType ${Date.now()}`,
    description: 'A default room type for seeding.',
    max_guests: 2,
    max_adults: 2,
    max_children: 0,
});

const defaultRoomCreator = async () => {
  const roomTypeId = await getOrCreateValidFK(
    RoomType,
    null,
    defaultRoomTypeCreator
  );
  const hotelId = (await RoomType.findByPk(roomTypeId)).hotel_id; // Lấy hotel_id từ room_type
  return Room.create({
    room_type_id: roomTypeId,
    hotel_id: hotelId,
    room_number: `ROOM-${Math.floor(Math.random() * 10000)}`,
    is_available: true,
    status: "ready",
  });
};

const defaultBookingCreator = async () => {
  const customerUserId = await getOrCreateValidFK(
    User,
    null,
    defaultUserCreator
  );
  return Booking.create({
    customer_user_id: customerUserId,
    hotel_name: "Default Booked Hotel",
    check_in_date: new Date(),
    check_out_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 ngày sau
    total_price: 100.0,
    num_guests: 1,
    status: "pending",
    booking_date: new Date(),
    amount_paid: 0.0,
  });
};

// Hàm chính để kiểm tra và thêm dữ liệu
async function checkAndAddData(Model, Data, tableName) {
  try {
    console.log(`Đang đồng bộ hóa bảng "${tableName}" với model...`);
    await Model.sync({ alter: true });
    console.log(
      `✅ Bảng "${tableName}" đã được đồng bộ hóa thành công! (Tạo mới nếu chưa có, hoặc cập nhật schema nếu có thay đổi)`
    );

    const existing = await Model.count();
    if (existing === 0) {
      console.log(`Đang seeding dữ liệu cho bảng "${tableName}"...`);
      await Model.bulkCreate(Data);
      console.log(`✨ Seeding dữ liệu cho bảng "${tableName}" thành công!`);
    } else {
      console.log(
        `⚠️ Bảng "${tableName}" đã có ${existing} bản ghi. Bỏ qua seeding.`
      );
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

    // 1. Đồng bộ hóa và seed các bảng cơ bản / không phụ thuộc trước tiên
    await checkAndAddData(UserType, userTypeData, "user_types");
    await checkAndAddData(Amenity, amenityData, "amenities");
    await checkAndAddData(HotelType, hotelTypeData, "hotel_types");
    await checkAndAddData(Ward, wardData, "wards");
    await checkAndAddData(Images, imagesData, "images");

    // 2. Xử lý và seed dữ liệu cho các bảng phụ thuộc (kiểm tra FKs)
    console.log("\n--- Xử lý dữ liệu phụ thuộc ---");

    // Xử lý User data (phụ thuộc UserType)
    const processedUsersData = await Promise.all(
      userData.map(async (user) => {
        const userTypeId = await getOrCreateValidFK(
          UserType,
          user.user_type_id,
          defaultUserTypeCreator
        );
        return { ...user, user_type_id: userTypeId };
      })
    );
    await checkAndAddData(User, processedUsersData, "users");

    // Xử lý Hotel data (phụ thuộc User, Ward, HotelType)
    const processedHotelsData = await Promise.all(
      hotelData.map(async (hotel) => {
        const slug  = getOrGenerateSlug(hotel.slug,hotel.name);
        const ownerUserId = await getOrCreateValidFK(
          User,
          hotel.owner_user_id,
          defaultUserCreator
        );
        const wardId = await getOrCreateValidFK(
          Ward,
          hotel.ward_id,
          defaultWardCreator
        );
        const hotelTypeId = await getOrCreateValidFK(
          HotelType,
          hotel.hotel_type_id,
          defaultHotelTypeCreator
        );
        return {
          ...hotel,
          slug: slug,
          owner_user_id: ownerUserId,
          ward_id: wardId,
          hotel_type_id: hotelTypeId,
        };
      })
    );
    await checkAndAddData(Hotel, processedHotelsData, "hotels");

    // Xử lý RoomType data (phụ thuộc Hotel)
    const processedRoomTypeData = await Promise.all(
      roomTypeData.map(async (roomType) => {
        const hotelId = await getOrCreateValidFK(
          Hotel,
          roomType.hotel_id,
          defaultHotelCreator
        );
        return { ...roomType, hotel_id: hotelId };
      })
    );
    await checkAndAddData(RoomType, processedRoomTypeData, "room_types");

    // Xử lý HotelImage data (phụ thuộc Hotel, Images)
    const processedHotelImagesData = await Promise.all(
      hotelImagesData.map(async (hotelImage) => {
        const hotelId = await getOrCreateValidFK(
          Hotel,
          hotelImage.hotel_id,
          defaultHotelCreator
        );
        const imageId = await getOrCreateValidFK(
          Images,
          hotelImage.image_id,
          defaultImagesCreator
        );
        return { ...hotelImage, hotel_id: hotelId, image_id: imageId };
      })
    );
    await checkAndAddData(HotelImage, processedHotelImagesData, "hotel_images");

    // Xử lý RoomTypeImage data (phụ thuộc RoomType, Images)
    const processedRoomTypeImagesData = await Promise.all(
      roomTypeImagesData.map(async (roomTypeImage) => {
        const roomTypeId = await getOrCreateValidFK(
          RoomType,
          roomTypeImage.room_type_id,
          defaultRoomTypeCreator
        );
        const imageId = await getOrCreateValidFK(
          Images,
          roomTypeImage.image_id,
          defaultImagesCreator
        );
        return {
          ...roomTypeImage,
          room_type_id: roomTypeId,
          image_id: imageId,
        };
      })
    );
    await checkAndAddData(
      RoomTypeImage,
      processedRoomTypeImagesData,
      "room_type_images"
    );

    // Xử lý RoomTypeAmenity data (phụ thuộc RoomType, Amenity)
    const processedRoomTypeAmenityData = await Promise.all(
      roomTypeAmenityData.map(async (item) => {
        const roomTypeId = await getOrCreateValidFK(
          RoomType,
          item.room_type_id,
          defaultRoomTypeCreator
        );
        const amenityId = await getOrCreateValidFK(
          Amenity,
          item.amenity_id,
          defaultAmenityCreator
        );
        return { ...item, room_type_id: roomTypeId, amenity_id: amenityId };
      })
    );
    await checkAndAddData(
      RoomTypeAmenity,
      processedRoomTypeAmenityData,
      "room_type_amenities"
    );

    // Xử lý HotelAmenity data (phụ thuộc Hotel, Amenity)
    const processedHotelAmenityData = await Promise.all(
      hotelAmenityData.map(async (item) => {
        const hotelId = await getOrCreateValidFK(
          Hotel,
          item.hotel_id,
          defaultHotelCreator
        );
        const amenityId = await getOrCreateValidFK(
          Amenity,
          item.amenity_id,
          defaultAmenityCreator
        );
        return { ...item, hotel_id: hotelId, amenity_id: amenityId };
      })
    );
    await checkAndAddData(
      HotelAmenity,
      processedHotelAmenityData,
      "hotel_amenities"
    );

    // Xử lý Room data (phụ thuộc RoomType, Hotel)
    const processedRoomData = await Promise.all(
      roomData.map(async (room) => {
        const roomTypeId = await getOrCreateValidFK(
          RoomType,
          room.room_type_id,
          defaultRoomTypeCreator
        );
        //kiểm tra hotel_id từ models hotels
        const hotelId = await getOrCreateValidFK(Hotel, room.hotel_id, defaultHotelCreator);
        return { ...room, room_type_id: roomTypeId, hotel_id: hotelId };
      })
    );
    await checkAndAddData(Room, processedRoomData, "rooms");

    // Xử lý RoomImage data (phụ thuộc Room, Images)
    const processedRoomImagesData = await Promise.all(
      roomImagesData.map(async (roomImage) => {
        const roomId = await getOrCreateValidFK(
          Room,
          roomImage.room_id,
          defaultRoomCreator
        );
        const imageId = await getOrCreateValidFK(
          Images,
          roomImage.image_id,
          defaultImagesCreator
        );
        return { ...roomImage, room_id: roomId, image_id: imageId };
      })
    );
    await checkAndAddData(RoomImage, processedRoomImagesData, "room_images");

    // Xử lý Booking data (phụ thuộc User)
    const processedBookingData = await Promise.all(
      bookingData.map(async (booking) => {
        const customerUserId = await getOrCreateValidFK(
          User,
          booking.customer_user_id,
          defaultUserCreator
        );
        return { ...booking, customer_user_id: customerUserId };
      })
    );
    await checkAndAddData(Booking, processedBookingData, "bookings");

    // LateCheckoutRate không có FK trực tiếp đến các bảng đã seed ở đây, có thể đặt ở đây
    await checkAndAddData(
      LateCheckoutRate,
      lateCheckoutRateData,
      "late_checkout_rates"
    );

    // Xử lý Promotion data (phụ thuộc Hotel, RoomType)
    const processedPromotionData = await Promise.all(
      promotionData.map(async (promotion) => {
        let hotelId = promotion.hotel_id
          ? await getOrCreateValidFK(
              Hotel,
              promotion.hotel_id,
              defaultHotelCreator
            )
          : null;
        let roomTypeId = promotion.room_type_id
          ? await getOrCreateValidFK(
              RoomType,
              promotion.room_type_id,
              defaultRoomTypeCreator
            )
          : null;
        return { ...promotion, hotel_id: hotelId, room_type_id: roomTypeId };
      })
    );
    await checkAndAddData(Promotion, processedPromotionData, "promotions");

    // Xử lý BookingRoom data (phụ thuộc Booking, Room)
    const processedBookingRoomData = await Promise.all(
      bookingRoomData.map(async (bookingRoom) => {
        const bookingId = await getOrCreateValidFK(
          Booking,
          bookingRoom.booking_id,
          defaultBookingCreator
        );
        const roomId = await getOrCreateValidFK(
          Room,
          bookingRoom.room_id,
          defaultRoomCreator
        );
        return { ...bookingRoom, booking_id: bookingId, room_id: roomId };
      })
    );
    await checkAndAddData(
      BookingRoom,
      processedBookingRoomData,
      "booking_rooms"
    );

    // Xử lý Payment data (phụ thuộc Booking)
    const processedPaymentData = await Promise.all(
      paymentData.map(async (payment) => {
        const bookingId = await getOrCreateValidFK(
          Booking,
          payment.booking_id,
          defaultBookingCreator
        );
        return { ...payment, booking_id: bookingId };
      })
    );
    await checkAndAddData(Payment, processedPaymentData, "payments");

    // Xử lý Review data (phụ thuộc User, Hotel, Booking)
    const processedReviewData = await Promise.all(
      reviewData.map(async (review) => {
        const userId = await getOrCreateValidFK(
          User,
          review.user_id,
          defaultUserCreator
        );
        const hotelId = await getOrCreateValidFK(
          Hotel,
          review.hotel_id,
          defaultHotelCreator
        );
        const bookingId = review.booking_id
          ? await getOrCreateValidFK(
              Booking,
              review.booking_id,
              defaultBookingCreator
            )
          : null;
        return {
          ...review,
          user_id: userId,
          hotel_id: hotelId,
          booking_id: bookingId,
        };
      })
    );
    await checkAndAddData(Review, processedReviewData, "reviews");

    console.log(
      "\n✅ Tất cả các bảng đã được đồng bộ hóa và/hoặc seed dữ liệu thành công!"
    );
  } catch (err) {
    console.error("❌ Lỗi khi thực hiện seed hoặc đồng bộ hóa:", err);
    if (err.name === "SequelizeConnectionRefusedError") {
      console.error(
        "Kiểm tra: Đảm bảo máy chủ MySQL của bạn đang chạy và thông tin kết nối (host, port, user, password) trong database.js là chính xác."
      );
    } else if (err.name === "SequelizeForeignKeyConstraintError") {
      console.error(
        "Lỗi khóa ngoại: Đã cố gắng tự động tạo dữ liệu phụ thuộc, nhưng vẫn có thể có lỗi nếu dữ liệu gốc quá không nhất quán. Kiểm tra lại dữ liệu JSON và thứ tự seeding."
      );
    } else if (err.name === "SequelizeUniqueConstraintError") {
      console.error(
        "Lỗi trùng lặp: Đảm bảo các trường có thuộc tính UNIQUE không bị trùng lặp trong dữ liệu JSON của bạn (ví dụ: email user, promo_code). Hoặc trong quá trình tạo dữ liệu mặc định."
      );
    } else if (err.name === "SequelizeValidationError") {
      console.error(
        "Lỗi xác thực dữ liệu: Kiểm tra dữ liệu JSON của bạn hoặc các hàm tạo mặc định có khớp với các quy tắc validation (allowNull, ENUM, v.v.) trong các model không."
      );
      // Log thêm chi tiết lỗi validation nếu có
      if (err.errors && err.errors.length > 0) {
        err.errors.forEach((e) => console.error(`  - ${e.path}: ${e.message}`));
      }
    }
  } finally {
    // Đóng kết nối sau khi hoàn thành hoặc gặp lỗi
    await sequelize.close();
    console.log("🔗 Kết nối cơ sở dữ liệu đã đóng.");
  }
})();
