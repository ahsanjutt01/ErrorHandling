const Sequelize = require('sequelize');


const sequelize = require('../utils/database');

const Project =  sequelize.define('projects', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: Sequelize.STRING,
    isActive: Sequelize.BOOLEAN
});

module.exports = Project;