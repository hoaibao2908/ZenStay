// models/RoomTypeImage.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const RoomType = require("./RoomTypesModel"); // Corrected reference
const Image = require("./ImageModel");

const RoomTypeImage = sequelize.define(
  "RoomTypeImage",
  {
    room_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: RoomType, // Corrected to RoomType
        key: "id",
      },
    },
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Image,
        key: "id",
      },
    },
    is_thumbnail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "ảnh đại diện đánh true, ko thì để false",
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Thứ tự hiển thị ảnh",
    },
  },
  {
    tableName: "room_type_images",
    timestamps: false,
    underscored: true,
    comment:
      "Bảng liên kết loại phòng với ảnh, lấy ảnh đại diện loại phòng qua bảng này",
  }
);

module.exports = RoomTypeImage;
