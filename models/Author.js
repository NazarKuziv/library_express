const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Author = sequelize.define('authors', {
   name: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

module.exports = Author