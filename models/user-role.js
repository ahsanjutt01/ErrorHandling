const Sequelize = require('sequelize');


const sequelize = require('../utils/database');

const UserRole =  sequelize.define('userRoles', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = UserRole;