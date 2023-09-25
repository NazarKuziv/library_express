const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define('categories', {
   name: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

module.exports = Category