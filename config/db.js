const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:@localhost:3306/library_db',
   {
      define: {
         timestamps: false
      }
   })

   ; (async () => {
      try {
         await sequelize.authenticate();
         console.log('Connection has been established successfully.');
      } catch (error) {
         console.error('Unable to connect to the database:', error);
      }
   })()

module.exports = sequelize