const { Hotel, Ward, User, HotelType, HotelImage, Room } = require("../models");
const slugify = require("slugify");
const Image = require("../models/ImageModel");

class hotelController {
  //[GET] /api/hotels
  async getHotels(req, res) {
    try {
      const hotels = await Hotel.findAll({ where: { is_deleted: null } });
      return res
        .status(200)
        .json({ data: hotels, message: "Lấy dữ liệu thành công" });
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .json({ message: "Lấy dữ liệu thất bại", error: error.message });
    }
  }

  //[GET] /api/hotels/:slug
  async getHotelById(req, res) {
    try {
      const slug = req.params.slug;
      const hotel = await Hotel.findOne({ where: { slug: slug } });
      if (hotel.is_deleted) {
        return res.status(404).json({ message: "Khách sạn đã bị xóa" });
      }
      return res
        .status(200)
        .json({ data: hotel, message: "Lấy dữ liệu thành công" });
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .json({ message: "Lấy dữ liệu thất bại", error: error.message });
    }
  }

  //[POST] /api/hotels
  async createHotel(req, res) {
    if (req.method === "POST") {
      try {
        //lấy dữ liệu từ body
        const {
          owner_user_id,
          name,
          description,
          hotel_type_id,
          address,
          ward_id,
          latitude,
          longitude,
          star_rating,
          contact_email,
          contact_phone,
          check_in_time,
          check_out_time,
          hot, // Assuming 'hot' can be sent from the client
          status, // Assuming 'status' can be sent from the client (e.g., 'pending')
        } = req.body;

        //kiểm tra dữ liệu đầu vào
        if (
          !owner_user_id ||
          !name ||
          !address ||
          !ward_id ||
          !star_rating ||
          !status
        ) {
          return res
            .status(200)
            .json({ message: "Thiếu các trường bắt buộc." });
        }

        //kiểm tra phường
        const ward = await Ward.findByPk(ward_id);
        if (!ward) {
          return res
            .status(200)
            .json({ message: `Phường${ward_id} không tồn tại.` });
        }

        //kiểm tra user_id

        const user = await User.findByPk(owner_user_id);
        if (!user) {
          return res
            .status(200)
            .json({ message: `User${owner_user_id} không tồn tại.` });
        }

        //kiểm tra kiểu khách sạn
        if (hotel_type_id) {
          // Chỉ kiểm tra nếu nó được cung cấp
          const hotelTypeExists = await HotelType.findByPk(hotel_type_id);
          if (!hotelTypeExists) {
            return res.status(404).json({
              message: "Loại khách sạn (hotel_type_id) không tồn tại.",
            });
          }
        }
        //tạo slug
        const generatedSlug = slugify(name, { lower: true, strict: true });
        //kiểm tra slug tồn tại
        const existingHotel = await Hotel.findOne({
          where: { slug: generatedSlug },
        });

        let finalSlug = generatedSlug;
        if (existingHotel) {
          finalSlug = `${generatedSlug}-${Date.now()}`;
          console.log(
            `Slug '${generatedSlug}' already exists. Using '${finalSlug}' instead.`
          );
        }
        //đẩy dữ liệu lên server

        const newHotel = await Hotel.create({
          owner_user_id,
          name,
          description,
          hotel_type_id,
          address,
          ward_id,
          latitude,
          longitude,
          star_rating,
          contact_email,
          contact_phone,
          check_in_time: check_in_time || "14:00:00",
          check_out_time: check_out_time || "12:00:00",
          slug: finalSlug,
          viewer: 0,
          hot: hot || false,
          status,
        });

        return res.status(201).json({
          message: "Thêm khách sạn thành công",
          hotel: newHotel,
        });
      } catch (error) {
        console.error("Lỗi khi thêm khách sạn:", error);
        if (error.name === "SequelizeValidationError") {
          const errors = error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          }));
          return res.status(400).json({
            message: "Lỗi xác thực dữ liệu",
            errors: errors,
          });
        }
        return res.status(500).json({
          message: "Lỗi server khi thêm dữ liệu",
          error: error.message,
        });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  //[PUT] /api/hotels/:id
  async updateHotel(req, res) {
    const { id } = req.params;
    if (req.method === "PUT") {
      try {
        const {
          name,
          description,
          hotel_type_id,
          address,
          ward_id,
          latitude,
          longitude,
          star_rating,
          contact_email,
          contact_phone,
          check_in_time,
          check_out_time,
          hot,
        } = req.body;
        //tìm kiếm hotel theo id
        const hotel = await Hotel.findByPk(id);
        if (!hotel) {
          return res
            .status(200)
            .json({ message: `Khách sạn${id} không tồn tại.` });
        }
        //kiểm tra phường
        if (ward_id) {
          const wardExit = await Ward.findByPk(ward_id);
          if (!wardExit) {
            return res
              .status(200)
              .json({ message: `Phường${ward_id} không tồn tại.` });
          }
        }
        //kiểm tra hotel_type
        if (hotel_type_id) {
          const hotelTypeExit = await HotelType.findByPk(hotel_type_id);
          if (!hotelTypeExit) {
            return res.status(404).json({
              message: "Loại khách sạn không tồn tại",
            });
          }
        }
        //tạo hotel mới
        const updateData = {
          description,
          hotel_type_id,
          address,
          ward_id,
          latitude,
          longitude,
          star_rating,
          contact_email,
          contact_phone,
          check_in_time,
          check_out_time,
          hot,
        };

        //nếu tên khách sạn được cập nhập , tạo slug mới
        if (name && name !== hotel.name) {
          const generatedSlug = slugify(name, { lower: true, strict: true });
          //kiểm tra slug
          const existingHotelWithNewSlug = await db.Hotel.findOne({
            //kiểm tra xem còn có khách sạn nào khác khách sạn có id này có cùng slug ko
            where: { slug: generatedSlug, id: { [db.Sequelize.Op.ne]: id } },
          });

          if (existingHotelWithNewSlug) {
            updateData.slug = `${generatedSlug}-${Date.now()}`;
            console.warn(
              `Slug '${generatedSlug}' đã tồn tại. Sử dụng '${updateData.slug}' thay thế.`
            );
          } else {
            updateData.slug = generatedSlug;
          }
          //cập nhập tên mới
          updateData.name = name;
        }
        //cập nhập dữ liệu
        await hotel.update(updateData);

        return res.status(200).json({
          message: "Cập nhật khách sạn thành công",
          hotel: hotel, // Trả về bản ghi đã cập nhật
        });
      } catch (error) {
        console.error("Lỗi khi cập nhật khách sạn:", error);
        if (error.name === "SequelizeValidationError") {
          const errors = error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          }));
          return res.status(400).json({
            message: "Lỗi xác thực dữ liệu khi cập nhật",
            errors: errors,
          });
        }
        return res.status(500).json({
          message: "Lỗi server khi cập nhật dữ liệu",
          error: error.message,
        });
      }
    } else {
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  // [DELETE] /api/hotels/:slug
  async deleteHotel(req, res) {
    if (req.method === "DELETE") {
      try {
        //kiểm tra hotel tồn tại
        const { slug } = req.params;
        const hotel = await Hotel.findOne({ where: { slug: slug } });
        if (!hotel) {
          return res.status(200).json({ message: "Khách sạn không tìm thấy." });
        }
        //kiểm tra khách sạn đã xóa chưa
        if (hotel.is_deleted === true) {
          return res
            .status(409)
            .json({ message: "Khách sạn này đã bị xóa rồi." });
        }

        //xóa mềm khách sạn
        hotel.is_deleted = true;
        hotel.deleted_at = new Date();
        await hotel.save();

        return res.status(200).json({
          message: "Xóa khách sạn thành công",
          data: hotel,
        });
      } catch (error) {
        console.error("Lỗi khi xóa mềm khách sạn:", error);
        return res.status(500).json({
          message: "Lỗi server khi xóa mềm dữ liệu",
          error: error.message,
        });
      }
    } else {
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  //[GET] /api/hotels/hot/:number
  async getHotHotels(req, res) {
    if (req.method === "GET") {
      try {
        //lấy số lượng sản phẩm cần lấy
        const number = parseInt(req.params.number);

        //kiểm tra number hợp lệ
        if (isNaN(number) || number <= 0) {
          res.status(400).json({ message: "Số lượng sản phẩm không hợp lệ" });
        }
        // lấy sản phẩm hot dữ trên số lượng này
        const hotHotels = await Hotel.findAll({
          where: { hot: true, is_deleted: false },
          order: [["viewer", "DESC"]],
          limit: number,
        });
        return res.status(200).json({
          message: "Lấy danh sách khách sạn hot thành công.",
          data: hotHotels,
        });
      } catch (error) {
        console.error("Lỗi khi lấy khách sạn hot:", error);
        return res.status(500).json({
          message: "Lỗi server khi lấy dữ liệu",
          error: error.message,
        });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  //[GET] /api/hotels/:id/images
  async getHotelImages(req, res) {
    if (req.method === "GET") {
      try {
        const hotelId = parseInt(req.params.id);

        //kiểm tra hotelId
        if (isNaN(hotelId) || hotelId <= 0) {
          return res.status(400).json({ message: "ID khách sạn không hợp lệ" });
        }
        const hotel = await Hotel.findByPk(hotelId);
        if (!hotel) {
          return res.status(404).json({ message: "Khách sạn không tồn tại" });
        }

        const hotelImages = await HotelImage.findAll({
          where: { hotel_id: hotelId },
          include: [
            {
              model: Image,
              attributes: ["id", "image_url", "alt_text"],
            },
          ],
          order: [["display_order", "ASC"]],
        });
        //hotel images lấy về có dạng
        /*
            {
            "hotel_id": 2,
            "image_id": 6,
            "is_thumbnail": false,
            "display_order": 3,
            "Image": {
                "id": 6,
                "image_url": "/images/hotels/thao_dien_resort_3.jpg",
                "alt_text": "Spa và phòng trị liệu Resort Thảo Điền"
            }
        }
        */
        // Flatten the result to just an array of image objects with their relation data
        const imagesWithMetadata = hotelImages.map((hi) => ({
          imageId: hi.image_id,
          url: hi.Image.image_url,
          altText: hi.Image.alt_text,
          isThumbnail: hi.is_thumbnail,
          displayOrder: hi.display_order,
        }));

        res.json({
          data: imagesWithMetadata,
          message: "Lấy dữ liệu thành công",
        });
      } catch (error) {
        console.error("Error fetching hotel images:", error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  //[GET] /api/hotels/:id/rooms
  async getHotelRooms(req, res) {
    if (req.method === "GET") {
      try {
        const hotelId = parseInt(req.params.id);
        //kiểm tra hotelId
        if (isNaN(hotelId) || hotelId <= 0) {
          return res.status(400).json({ message: "ID khách sạn không hợp lệ" });
        }
        const hotel = await Hotel.findByPk(hotelId);
        if (!hotel) {
          return res.status(404).json({ message: "Khách sạn không tồn tại" });
        }
        const rooms = await Room.findAll({
          where: { hotel_id: hotelId },
        });
        //kiểm tra room trả về
        if (!rooms || rooms.length === 0) {
          return res
            .status(200)
            .json({ data: [], message: "Không có phòng nào" });
        }
        res.json({
          data: rooms,
          message: "Lấy dữ liệu thành công",
        });
      } catch (error) {
        console.error("Error fetching hotel rooms:", error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  //[GET] /api/hotesl/:id/bestPrice
  async getHotelBestPrice(req, res) {
    if (req.method === "GET") {
      try {
        const hotelId = parseInt(req.params.id);
        //kiểm tra hotelId
        if (isNaN(hotelId) || hotelId <= 0) {
          return res.status(400).json({ message: "ID khách sạn không hợp lệ" });
        }
        const hotel = await Hotel.findByPk(hotelId);
        if (!hotel) {
          return res.status(404).json({ message: "Khách sạn không tồn tại" });
        }
        const rooms = await Room.findAll({
          where: { hotel_id: hotelId },
        });

        //kiểm tra room trả về
        if (!rooms || rooms.length === 0) {
          return res
            .status(200)
            .json({ data: [], message: "Không có phòng nào" });
        }
        //từ rooms trả về lấy room có giá thấp nhất
        let minPriceRoom = rooms[0];
        for (let i = 1; i < rooms.length; i++) {
          // Bắt đầu từ phòng thứ hai
          let room = rooms[i];
          if (room.base_price_per_night < minPriceRoom.base_price_per_night) {
            minPriceRoom = room;
          }
        }
        res.status(200).json({
          data: minPriceRoom,
          message: "Lấy dữ liệu thành công",
        });
      } catch (error) {
        console.error("Error fetching hotel room best price:", error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}

module.exports = new hotelController();
