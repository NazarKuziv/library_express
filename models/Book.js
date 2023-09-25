const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Book = sequelize.define('books', {
   title: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

module.exports = Book