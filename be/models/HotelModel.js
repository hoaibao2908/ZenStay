// models/Hotel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./UserModel"); // For owner_user_id
const Ward = require("./WardModel"); // For ward_id
const HotelType = require("./HotelTypesModel"); // For hotel_type_id

const Hotel = sequelize.define(
  "Hotel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    owner_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      comment: "id chủ khách sạn",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hotel_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Should be allowNull: false if every hotel must have a type
      references: {
        model: HotelType,
        key: "id",
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ward_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ward,
        key: "id",
      },
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      comment: "vĩ độ để hiển thị bản đồ",
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      comment: "kinh độ để hiển thị bản đồ",
    },
    star_rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      comment: "Số sao đánh giá của khách sạn (từ 1 đến 5 sao)",
    },
    contact_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    check_in_time: {
      type: DataTypes.TIME,
      defaultValue: "14:00:00",
      comment: "Giờ nhận phòng",
    },
    check_out_time: {
      type: DataTypes.TIME,
      defaultValue: "12:00:00",
      comment: "Giờ trả phòng",
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true, // Added unique constraint
      allowNull: false,
    },
    viewer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    hot: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      comment: "trạng thái phê duyệt bởi admin",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "hotels",
    timestamps: true,
    underscored: true,
    deletedAt: "deleted_at",
  }
);

module.exports = Hotel;
