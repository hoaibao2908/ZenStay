// models/Booking.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./UserModel"); // For customer_user_id

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    customer_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    hotel_name : {
      type : DataTypes.STRING(250),
      allowNull : false
    },
    check_in_date: {
      type: DataTypes.DATEONLY, // Use DATEONLY for just date without time
      allowNull: false,
      comment: "Ngày nhận phòng",
    },
    check_out_date: {
      type: DataTypes.DATEONLY, // Use DATEONLY for just date without time
      allowNull: false,
      comment: "Ngày trả phòng",
      validate: {
        isAfterCheckIn(value) {
          if (new Date(value) <= new Date(this.check_in_date)) {
            throw new Error("Check-out date must be after check-in date.");
          }
        },
      },
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    num_guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Số lượng khách",
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      allowNull: false,
      defaultValue: "pending",
      comment: "Trạng thái đặt phòng",
    },
    booking_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: "Thời gian đặt phòng",
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: "Tổng số tiền đã thanh toán cho booking này, hoặc tiền cọc",
    },
    special_requests: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Yêu cầu đặc biệt của khách",
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
    tableName: "bookings",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Booking;
