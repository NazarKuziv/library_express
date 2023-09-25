const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Librarian = sequelize.define('librarians', {
   name: {
      type: DataTypes.STRING,
   },
   email: {
      type: DataTypes.STRING,
   },
   password: {
      type: DataTypes.STRING,
   },
   address: {
      type: DataTypes.STRING,
   },
   phone_number: {
      type: DataTypes.STRING,
   }
}, {
   timestamps: false
});

module.exports = Librarian