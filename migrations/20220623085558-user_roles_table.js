'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_roles', {
      id: Sequelize.INTEGER,
      user_id: Sequelize.STRING,
      role_id: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_roles');
  }
};
