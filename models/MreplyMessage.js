"use_strict";

module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('message_replies', {
        id: {
            type: DataTypes.INTEGER,
            // defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            autoIncrement: true
        },
        keyword: DataTypes.STRING,
        message: DataTypes.TEXT,
        type: DataTypes.STRING,
        link_media: DataTypes.STRING,
        number_destination: DataTypes.STRING(15),
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}