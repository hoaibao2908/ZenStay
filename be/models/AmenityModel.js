// models/Amenity.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//tiện ích
const Amenity = sequelize.define(
  "Amenity",
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
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    icon_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "amenities",
    timestamps: false,
  }
);

module.exports = Amenity;
