// models/Payment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Booking = require("./BookingsModel");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Booking,
        key: "id",
      },
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
      comment: "ID giao dịch từ cổng thanh toán",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment:
        "Số tiền giao dịch, số dương là đã thanh toán, số âm là hoàn tiền",
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "VND",
      comment: "Đơn vị tiền tệ",
    },
    payment_method: {
      type: DataTypes.ENUM(
        "Momo",
        "VNPay",
        "Credit Card",
        "Cash At Hotel",
        "Other"
      ),
      allowNull: true,
      comment: "Phương thức thanh toán",
    },
    payment_status: {
      type: DataTypes.ENUM(
        "Pending",
        "Success",
        "Failed",
        "Refunded",
        "Cancelled"
      ),
      allowNull: false,
      defaultValue: "Pending",
      comment:
        "Trạng thái của giao dịch: Pending, Success, Failed, Refunded, Cancelled",
    },
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: "Thời gian giao dịch diễn ra",
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
    tableName: "payments", // Corrected to plural 'payments'
    timestamps: true,
    underscored: true,
    comment: "Quản lý thu chi thông qua bảng này",
  }
);

module.exports = Payment;
