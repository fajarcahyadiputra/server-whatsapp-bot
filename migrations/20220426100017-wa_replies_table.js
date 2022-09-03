'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wa_replies', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      keyword: Sequelize.STRING,
      replies: Sequelize.TEXT,
      type: Sequelize.ENUM("media", "text"),
      linkMedia: Sequelize.STRING
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wa_replies');
  }
};
