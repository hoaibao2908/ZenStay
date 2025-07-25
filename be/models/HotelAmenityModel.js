// models/HotelAmenity.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Hotel = require("./HotelModel");
const Amenity = require("./AmenityModel");

const HotelAmenity = sequelize.define(
  "HotelAmenity",
  {
    hotel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Hotel,
        key: "id",
      },
    },
    amenities_id: {
      // Renamed from amenity_id to match your schema
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Amenity,
        key: "id",
      },
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
    tableName: "hotel_amenities",
    timestamps: true,
    underscored: true,
  }
);

module.exports = HotelAmenity;
