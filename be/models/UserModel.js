// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const UserType = require("./UserTypesModel"); // Import UserType model

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    is_locked: {
      // Corrected from is_looked
      type: DataTypes.BOOLEAN, // Changed to BOOLEAN for true/false
      defaultValue: false, // Changed default to false
      allowNull: true, // Allow null if not explicitly locked
    },
    locked_until: {
      type: DataTypes.DATE, // Changed to DATETIME for precision
      allowNull: true,
    },
    login_fail_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false, // Should be not null
    },
    user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserType, // This establishes the foreign key relationship
        key: "id",
      },
    },
    email_verify_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Trạng thái kích hoạt tài khoản",
    },
    created_at: {
      // Corrected from created_ad
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      // Corrected from updated_ad
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: true, // Sequelize will manage created_at and updated_at
    underscored: true, // Use snake_case for column names in the DB
  }
);

module.exports = User;
