'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: Sequelize.INTEGER,
      name: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
