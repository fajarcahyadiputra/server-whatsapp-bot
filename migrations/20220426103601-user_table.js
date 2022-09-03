'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: Sequelize.STRING,
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: Sequelize.STRING,
      isActive: Sequelize.BOOLEAN,
      picture: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
