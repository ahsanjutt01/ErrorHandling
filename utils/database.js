const Sequelize = require('sequelize');

const { dbName, dbUserName, dbPassword, dbHost, dbPort} = require('../config');
const Op = Sequelize.Op;
const operatorsAliases = {
  $or: Op.or,
  $eq: Op.eq,
  $ne: Op.ne,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
  $and: Op.and,
  $like: Op.like,
};

console.log('_DB_Name', dbName, ' _DB_USER_NAME ', dbUserName, '_DB_PASSWORD ', dbPassword );

const sequelize = new Sequelize(dbName, dbUserName, dbPassword, {
    dialect: 'mysql',
    host: dbHost,
    port: dbPort,
    operatorsAliases: operatorsAliases
});


module.exports = sequelize;