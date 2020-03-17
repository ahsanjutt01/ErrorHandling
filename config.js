// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    node_env : process.env.NODE_ENV,
    port: process.env.PORT,
    dbName: process.env.DB_Name,
    dbUserName: process.env.DB_USER_NAME,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    userTypeAdmin: process.env.USER_TYPE_ADMIN,
    userTypeProjectManager: process.env.USER_TYPE_PROJECT_MANAGER,
    userTypeTeam: process.env.USER_TYPE_TEAM,
    projectManagerDefaultPassword: process.env.PROJECT_MANAGER_DEFAULT_PASSWORD,
    teamDefaultPassword: process.env.TEAM_DEFAULT_PASSWORD,
    sendGridApiKey: process.env.SENDGRID_API_KEY
};