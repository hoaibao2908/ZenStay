// models/RoomType.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RoomType = sequelize.define(
  "RoomType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255), // Assuming description is VARCHAR(255) as per schema
      allowNull: false, // Your schema had not null for description
    },
    max_guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_children: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "room_types", // Corrected to room_types (plural)
    timestamps: false,
  }
);

module.exports = RoomType;
