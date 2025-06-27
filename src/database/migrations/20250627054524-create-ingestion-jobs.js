'use strict';

const { DataTypes } = require('sequelize');

const IngestionStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
};

const IngestionTriggerType = {
  MANUAL: 'manual',
  WEBHOOK: 'webhook',
};

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('ingestion_jobs', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(IngestionStatus)),
        allowNull: false,
        defaultValue: IngestionStatus.PENDING,
      },
      document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'documents',
          key: 'document_id',
        },
        onDelete: 'CASCADE',
      },
      triggered_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'SET NULL',
      },
      trigger_type: {
        type: DataTypes.ENUM(...Object.values(IngestionTriggerType)),
        allowNull: false,
      },
      log: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ingestion_jobs');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_ingestion_jobs_status";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_ingestion_jobs_trigger_type";`);
  },
};
