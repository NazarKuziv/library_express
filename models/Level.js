const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Level = sequelize.define('levels', {
   name: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

module.exports = Level