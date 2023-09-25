const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Borrowing = sequelize.define('borrowings', {
   borrowed_date: {
      type: DataTypes.DATE,
   },
   return_date: {
      type: DataTypes.DATE,
   },
   returned: {
      type: DataTypes.BOOLEAN,
   },
}, {
   timestamps: false
});

module.exports = Borrowing