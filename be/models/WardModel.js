// models/Ward.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ward = sequelize.define(
  "Ward",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    cities: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "wards",
    timestamps: false,
    // UNIQUE constraint on (name, cities) to allow same ward name in different cities
    indexes: [
      {
        unique: true,
        fields: ["name", "cities"],
      },
    ],
  }
);

module.exports = Ward;
