'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('message_reply',
      {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        message: Sequelize.TEXT,
        number: Sequelize.STRING(15),
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('message_reply');
  }
};
