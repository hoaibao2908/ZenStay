// models/RoomImage.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Room = require("./RoomsModels");
const Image = require("./ImageModel");

const RoomImage = sequelize.define(
  "RoomImage",
  {
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Room,
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
    tableName: "room_images",
    timestamps: false,
    underscored: true,
    comment:
      "Bảng liên kết từng phòng với ảnh, lấy ảnh từng phòng qua bảng này",
  }
);

module.exports = RoomImage;
