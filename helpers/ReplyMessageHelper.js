const { ReplyMessage } = require('../models');
const functionExists = require('./CheckFunctionExistsHelper');
const moment = require('moment-timezone');

const insertReplyMessage = async (message, number) => {
    try {
        await ReplyMessage.create({
            message,
            number
        });
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = insertReplyMessage