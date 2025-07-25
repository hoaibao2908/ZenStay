// models/BookingRoom.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Booking = require("./BookingsModel");
const Room = require("./RoomsModels");

const BookingRoom = sequelize.define(
  "BookingRoom",
  {
    booking_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Booking,
        key: "id",
      },
    },
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Room,
        key: "id",
      },
    },
    price_at_booking: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Giá có thể khác giá gốc do khuyến mãi",
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
    tableName: "booking_rooms",
    timestamps: true,
    underscored: true,
    comment: "Bảng liên kết booking với từng phòng cụ thể",
  }
);

module.exports = BookingRoom;
