// models/Promotion.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Hotel = require("./HotelModel");
const RoomType = require("./RoomTypesModel"); // Corrected reference

//khuyến mãi
const Promotion = sequelize.define(
  "Promotion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Added autoIncrement as it's a primary key
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if promotion is site-wide
      references: {
        model: Hotel,
        key: "id",
      },
    },
    room_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if promotion applies to all room types
      references: {
        model: RoomType, // Corrected to RoomType
        key: "id",
      },
    },
    promo_code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
      comment: "Mã khuyến mãi",
    },
    discount_type: {
      type: DataTypes.ENUM("Percentage", "Fixed Amount"),
      allowNull: false,
      comment: "Loại giảm giá (giảm theo % hay số tiền cụ thể)",
    },
    discount_value: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: "Giá trị giảm giá",
    },
    min_booking_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "giá trị đặt phòng tối thiểu để áp dụng",
    },
    min_night_amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "số đêm tối thiểu để áp dụng",
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Ngày bắt đầu khuyến mãi",
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Ngày kết thúc khuyến mãi",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false, // Should be not null
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "promotions",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Promotion;
