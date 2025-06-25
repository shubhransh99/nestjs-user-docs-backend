'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const timestamp = new Date();

    // Get all roles
    const roles = await queryInterface.sequelize.query(
      `SELECT role_id, name FROM roles`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get all permissions
    const permissions = await queryInterface.sequelize.query(
      `SELECT permission_id, name FROM permissions`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const rolePerms = [];

    for (const role of roles) {
      let matchedPermissions = [];

      if (role.name === 'admin') {
        matchedPermissions = permissions; // all
      } else if (role.name === 'editor') {
        matchedPermissions = permissions.filter(p => p.name.endsWith('.read') || p.name.endsWith('.update'));
      } else if (role.name === 'viewer') {
        matchedPermissions = permissions.filter(p => p.name.endsWith('.read'));
      }

      for (const perm of matchedPermissions) {
        rolePerms.push({
          role_id: role.role_id,
          permission_id: perm.permission_id,
          created_at: timestamp,
          updated_at: timestamp,
        });
      }
    }

    await queryInterface.bulkInsert('role_permissions', rolePerms);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
