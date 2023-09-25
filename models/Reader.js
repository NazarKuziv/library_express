const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Reader = sequelize.define('readers', {
   name: {
      type: DataTypes.STRING,
   },
   email: {
      type: DataTypes.STRING,
   },
   address: {
      type: DataTypes.STRING,
   },
   phone_number: {
      type: DataTypes.STRING,
   },
   penalty: {
      type: DataTypes.INTEGER,
   }
}, {
   timestamps: false
});

module.exports = Reader