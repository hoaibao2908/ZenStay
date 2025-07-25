const { Sequelize } = require("sequelize");

// Tạo đối tượng kết nối đến database
sequelize = new Sequelize("datn_hotels", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3307,
});

module.exports = sequelize;

