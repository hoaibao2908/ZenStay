// models/Image.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Image = sequelize.define(
  "Image",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    alt_text: {
      type: DataTypes.STRING(255),
      allowNull: true, // Alt text can be null
      comment: "Mô tả thay thế cho ảnh",
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "images",
    timestamps: true,
    updatedAt: false, // Only created_at in this table based on your schema
    underscored: true,
  }
);

module.exports = Image;
