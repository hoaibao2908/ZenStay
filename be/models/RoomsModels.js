// models/Room.js
const { DataTypes, ENUM } = require("sequelize");
const sequelize = require("../config/database");
const Hotel = require("./HotelModel");
const RoomType = require("./RoomTypesModel");

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Hotel,
        key: "id",
      },
      comment: "Khách sạn sở hữu phòng này",
    },
    room_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: RoomType,
        key: "id",
      },
      comment: "Loại phòng của phòng này",
    },
    room_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "Số phòng (e.g., 101, 205A)",
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Tầng của phòng",
    },
    bed_types: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "loại giường",
    },
    area_sqm: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      comment: "diện tích phòng",
    },
    base_price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "occupied", "cleaning", "maintenance"),
      allowNull: false,
      defaultValue: "available",
      comment:
        "Trạng thái phòng (available: Phòng trống, sẵn sàng cho thuê. occupied: Phòng đang có khách. cleaning: Phòng đang được dọn dẹp sau khi khách trả phòng. maintenance: Phòng đang được bảo trì, không thể cho thuê.)",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "rooms",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Room;
