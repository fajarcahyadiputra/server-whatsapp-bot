"use_strict";

module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        isActive: DataTypes.BOOLEAN,
        picture: DataTypes.STRING,
        name: DataTypes.STRING,
        password: DataTypes.STRING,
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}