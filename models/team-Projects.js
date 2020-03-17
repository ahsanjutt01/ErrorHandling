const Sequelize = require('sequelize');


const sequelize = require('../utils/database');

const TeamProject =  sequelize.define('teamProjects', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isActive: Sequelize.BOOLEAN
});

module.exports = TeamProject;