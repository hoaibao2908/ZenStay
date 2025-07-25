const { where } = require("sequelize");
const { HotelType } = require("../models");
class hotelTypeController {
  //[GET] /api/hotel-types/type
  async get(req, res) {
    if (req.method === "GET") {
      try {
        const hotelType = await HotelType.findAll();
        if (!hotelType) {
          res.status(200).json({ message: "Không tìm thấy loại khách sạn" });
        }
        res
          .status(200)
          .json({ data: hotelType, message: "Lấy dữ liệu thành công" });
      } catch (error) {
        console.log(error);
        return res
          .status(200)
          .json({ message: "Lấy dữ liệu thất bại", error: error.message });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  //[GET] /api/hotel-types/:name
  async getById(req, res) {
    if (req.method === "GET") {
      try {
        const { name } = req.params;
        const hotelType = await HotelType.findOne({ where: { name: name } });
        if (!hotelType) {
          res
            .status(200)
            .json({ message: "Không tìm thấy loại khách sạn với tên này" });
        }
        res
          .status(200)
          .json({ data: hotelType, message: "Lấy dữ liệu thành công" });
      } catch (error) {
        console.log(error);
        return res
          .status(200)
          .json({ message: "Lấy dữ liệu thất bại", error: error.message });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  //[POST] /api/hotel-types/type
  async create(req, res) {
    if (req.method === "POST") {
      try {
        const { name, description } = req.body;
        if (!name) {
          return res
            .status(200)
            .json({ message: "Tên loại khách sạn là bắt buộc" });
        }
        //kiểm tra tên (name unique)
        const generatedSlug = slugify(name, { lower: true, strict: true });

        // Check for unique name AND slug
        const [existingTypeByName, existingTypeBySlug] = await Promise.all([
          HotelType.findOne({ where: { name: name } }),
          HotelType.findOne({ where: { slug: generatedSlug } }),
        ]);
        if (existingTypeByName) {
          return res
            .status(409)
            .json({ message: "Tên loại khách sạn này đã tồn tại." });
        }

        //nếu slug loại khách sạn đã tồn tại thêm ngày
        if (existingTypeBySlug) {
          const uniqueSlug = `${generatedSlug}-${Date.now()}`;
          console.warn(
            `Slug '${generatedSlug}' already exists for HotelType. Using '${uniqueSlug}' instead.`
          );
          //thay slug
          generatedSlug = uniqueSlug;
        }

        const newHotelType = await HotelType.create({
          name,
          slug: generatedSlug,
          description,
        });
        return res.status(201).json({
          message: "Tạo loại khách sạn thành công",
          hotelType: newHotelType,
        });
      } catch (error) {
        console.error("Lỗi khi tạo loại khách sạn:", error);
        if (error.name === "SequelizeUniqueConstraintError") {
          return res
            .status(409)
            .json({ message: "Tên loại khách sạn đã tồn tại." });
        }
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
          message: "Lỗi server khi tạo dữ liệu",
          error: error.message,
        });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  //[PUT] /api/hotel-types/
  async update(req, res) {
    if (req.method === "PUT") {
      try {
        const { name, description } = req.body;

        //kiểm tra name tồn tại
        const hotelType = await HotelType.findOne({ where: { name: name } });
        if (!hotelType) {
          return res
            .status(404)
            .json({ message: "Loại khách sạn không tồn tại." });
        }

        //kiểm tra slug
        if (name && name !== hotelType.name) {
          const generatedSlug = slugify(name, { lower: true, strict: true });
          const existingTypeBySlug = await HotelType.findOne({
            where: { slug: generatedSlug },
          });
          if (existingTypeBySlug) {
            hotelType.slug = `${generatedSlug}-${Date.now()}`;
            console.warn(
              `Slug '${generatedSlug}' đã tồn tại. Sử dụng '${generatedSlug}' thay thế.`
            );
          } else {
            hotelType.slug = generatedSlug;
          }
          hotelType.name = name;
        }
        //cập nhập dữ liệu
        await hotelType.update();
        return res.status(200).json({
          message: "Cập nhật loại khách sạn thành công",
        });
      } catch (error) {}
    } else {
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  //[DELETE] /api/hotel-types/:name
  async delete(req, res) {
    if (req.method === "DELETE") {
      try {
      } catch (error) {}
    } else {
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}

module.exports = new hotelTypeController();
