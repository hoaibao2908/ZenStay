// models/Review.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Hotel = require("./HotelModel");
const User = require("./UserModel"); // For customer_id

const Review = sequelize.define(
  "Review",
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
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      comment: "CHECK (rating BETWEEN 1 AND 5)",
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    review_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false, // Should be not null
      comment: "Trạng thái phê duyệt bởi admin/ chủ ks",
    },
  },
  {
    tableName: "reviews",
    timestamps: false, // Only review_date, not created_at/updated_at
    underscored: true,
  }
);

module.exports = Review;
