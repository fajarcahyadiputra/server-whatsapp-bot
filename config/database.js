require('dotenv').config();
const {
    USER_NAME,
    DBNAME,
    DIALECT,
    PASSWORD,
    HOSTNAME,
} = process.env;

module.exports = {
    "development": {
        "username": USER_NAME,
        "password": PASSWORD,
        "database": DBNAME,
        "host": HOSTNAME,
        "dialect": DIALECT,
        timezone: '+07:00',
        dialectOptions: {
            useUTC: false, // for reading from database
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        imezone: '+07:00', // for writing to database
    },
    "production": {
        "username": USER_NAME,
        "password": PASSWORD,
        "database": DBNAME,
        "host": HOSTNAME,
        "dialect": DIALECT,
        timezone: 'Asia/jakarta',
        dialectOptions: {
            useUTC: false, // for reading from database
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
}

