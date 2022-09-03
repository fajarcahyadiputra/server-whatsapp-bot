require('dotenv').config();
const dbConfig = require("../config/database");
const Sequelize = require("sequelize");
const NODE_ENV = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(dbConfig[NODE_ENV].database, dbConfig[NODE_ENV].username, dbConfig[NODE_ENV].password, {
    host: dbConfig[NODE_ENV].host,
    dialect: dbConfig[NODE_ENV].dialect,
    timezone: dbConfig[NODE_ENV].timezone,
    pool: {
        max: dbConfig[NODE_ENV].pool.max,
        min: dbConfig[NODE_ENV].pool.min,
        acquire: dbConfig[NODE_ENV].pool.acquire,
        idle: dbConfig[NODE_ENV].pool.idle,
    },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.ReplyMessage = require("./MreplyMessage.js")(sequelize, Sequelize);
db.WaReplies = require("./MwaReplies")(sequelize, Sequelize);
db.User = require("./Muser")(sequelize, Sequelize);


module.exports = db;