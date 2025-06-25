'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const timestamp = new Date();
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        name: 'editor',
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        name: 'viewer',
        created_at: timestamp,
        updated_at: timestamp,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
