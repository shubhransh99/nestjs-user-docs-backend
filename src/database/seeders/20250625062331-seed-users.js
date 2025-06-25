'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const timestamp = new Date();

    const roles = await queryInterface.sequelize.query(
      `SELECT role_id, name FROM roles ORDER BY role_id ASC`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const adminId = roles.find(r => r.name === 'admin')?.role_id;
    const editorId = roles.find(r => r.name === 'editor')?.role_id;
    const viewerId = roles.find(r => r.name === 'viewer')?.role_id;

    const users = [];

    for (let i = 1; i <= 1000; i++) {
      let role_id = viewerId;
      if (i <= 5) role_id = adminId;
      else if (i <= 25) role_id = editorId;

      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role_id,
        created_at: timestamp,
        updated_at: timestamp,
      });
    }

    await queryInterface.bulkInsert('users', users);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
