// models/LateCheckoutRate.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Hotel = require("./HotelModel");

const LateCheckoutRate = sequelize.define(
  "LateCheckoutRate",
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
      comment: "Khách sạn áp dụng quy tắc này",
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: "Giờ bắt đầu áp dụng mức giá",
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: "Giờ kết thúc áp dụng mức giá",
      validate: {
        isAfterStartTime(value) {
           if (new Date(value) <= new Date(this.check_in_date)) {
            throw new Error("Check-out date must be after check-in date.");
          }
        },
      },
    },
    price_type: {
      type: DataTypes.ENUM("half_day_rate", "full_day_rate"),
      allowNull: false,
      comment: "Loại giá: nửa ngày, cả ngày",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Giá trị áp dụng",
    },
  },
  {
    tableName: "late_checkout_rates",
    timestamps: false, // No created_at/updated_at usually for rate rules
    underscored: true,
    comment: "Các quy tắc giá cho việc trả phòng muộn",
  }
);

module.exports = LateCheckoutRate;
