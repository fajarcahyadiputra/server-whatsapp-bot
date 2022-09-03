'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      id: Sequelize.INTEGER,
      role_id: Sequelize.STRING,
      permission_id: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permissions');
  }
};
