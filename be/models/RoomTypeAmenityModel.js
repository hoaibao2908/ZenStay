// models/RoomTypeAmenity.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const RoomType = require("./RoomTypesModel"); // Corrected reference
const Amenity = require("./AmenityModel");

const RoomTypeAmenity = sequelize.define(
  "RoomTypeAmenity",
  {
    room_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: RoomType, // Corrected to RoomType
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
    tableName: "room_type_amenities",
    timestamps: true,
    underscored: true,
  }
);

module.exports = RoomTypeAmenity;
