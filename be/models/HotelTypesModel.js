// models/HotelType.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HotelType = sequelize.define(
  "HotelType",
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
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "hotel_types",
    timestamps: false,
  }
);

module.exports = HotelType;
