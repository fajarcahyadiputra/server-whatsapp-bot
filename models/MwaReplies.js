"use_strict";

module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('whatsapp_replies', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        keyword: DataTypes.STRING,
        link_media: DataTypes.STRING,
        name: DataTypes.STRING,
        roll_sub: DataTypes.STRING,
        type: DataTypes.ENUM("text", 'media'),
        isActive: DataTypes.INTEGER,
        text: DataTypes.STRING,
        created_at: DataTypes.STRING,
        updated_at: DataTypes.STRING
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}