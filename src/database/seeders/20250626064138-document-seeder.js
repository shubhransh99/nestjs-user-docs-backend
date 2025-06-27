'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT user_id FROM users WHERE deleted_at IS NULL;`
    );

    const userIds = users[0].map(u => u.user_id);
    if (userIds.length === 0) {
      console.warn('No users found. Cannot seed documents.');
      return;
    }

    const documents = [];
    for (let i = 0; i < 10000; i++) {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      const mime = faker.system.mimeType();
      documents.push({
        title: faker.lorem.words(4),
        description: faker.lorem.sentences(2),
        file_url: `uploads/documents/fake_doc_${i}.pdf`,
        file_type: mime,
        created_by: randomUserId,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('documents', documents);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('documents', null, {});
  },
};
