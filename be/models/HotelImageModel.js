// models/HotelImage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Hotel = require('./HotelModel');
const Image = require('./ImageModel');

const HotelImage = sequelize.define('HotelImage', {
  hotel_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Composite primary key
    references: {
      model: Hotel,
      key: 'id',
    },
    comment: "id khách sạn",
  },
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Composite primary key
    references: {
      model: Image,
      key: 'id',
    },
    comment: "id ảnh",
  },
  is_thumbnail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "ảnh đại diện đánh true, ko thì để false",
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null if order is not strict
    comment: "Thứ tự hiển thị ảnh",
  },
}, {
  tableName: 'hotel_images',
  timestamps: false, // No created_at/updated_at for this join table usually
  underscored: true,
  comment: "Bảng liên kết khách sạn với ảnh, lấy ảnh đại diện khách sạn qua bảng này",
});

module.exports = HotelImage;