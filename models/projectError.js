
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
        type: Sequelize.STRING(3000),
        allowNull: false
    },
    description: Sequelize.STRING(5000),
    isResolved: Sequelize.BOOLEAN,
    isWorking: Sequelize.BOOLEAN,
    isActive: Sequelize.BOOLEAN
});

module.exports = Project;
