const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Publisher = sequelize.define('publishers', {
   name: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

module.exports = Publisher