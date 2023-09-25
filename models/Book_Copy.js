const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Book_Copy = sequelize.define('book_copies', {
   year_published: {
      type: DataTypes.INTEGER,
   },
   number_of_copies: {
      type: DataTypes.INTEGER,
   },
   in_stock: {
      type: DataTypes.INTEGER,
   },
   language: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

module.exports = Book_Copy