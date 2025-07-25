const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Điều chỉnh đường dẫn nếu cần

const UserType = sequelize.define(
  "UserType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "khách hàng, chủ khách sạn, admin",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "user_types",
    timestamps: false, // Bảng này không có created_at, updated_at
  }
);

module.exports = UserType;
