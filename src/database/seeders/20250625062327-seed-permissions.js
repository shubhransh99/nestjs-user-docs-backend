'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const timestamp = new Date();
    const modules = ['user', 'role', 'permission', 'document'];
    const actions = ['create', 'read', 'update', 'delete'];

    const permissions = [];

    for (const module of modules) {
      for (const action of actions) {
        permissions.push({
          name: `${module}.${action}`,
          description: `Allows user to ${action} ${module}`,
          created_at: timestamp,
          updated_at: timestamp,
        });
      }
    }
    permissions.push({
      name: 'ingestion.trigger',
      description: 'Permission to trigger document ingestion',
      created_at: timestamp,
      updated_at: timestamp,
    })
    await queryInterface.bulkInsert('permissions', permissions);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
