const Sequelize = require('sequelize');


const sequelize = require('../utils/database');

const ProjectManagerProject =  sequelize.define('projectManagerProjects', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isActive: Sequelize.BOOLEAN
});

module.exports = ProjectManagerProject;