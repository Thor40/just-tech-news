// import the Seuqlize constructor from the library
const Sequelize = require('sequelize');
// just execute and all data in .env available with 'process.env.<ENVIRONMENT-VARIABLE-NAME>'
require('dotenv').config();

// create connection to our database, pass in your MySQL information for username and password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;