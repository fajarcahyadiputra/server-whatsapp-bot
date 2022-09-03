'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
      id: Sequelize.INTEGER,
      title: Sequelize.STRING,
      slug: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permissions');
  }
};
