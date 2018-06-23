module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'tech',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        parent: {
          type: Sequelize.INTEGER,
        },
        body: {
          type: Sequelize.TEXT,
        },
        identity_id: {
          type: Sequelize.UUID,
          references: {
            model: 'identities',
            key: 'id',
          },
        },
        attachment_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'attachments',
            key: 'id',
          },
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        schema: 'board',
        freezeTableName: true,
      }
    )
    return queryInterface.bulkInsert('boards', [{ id: 'tech', label: 'Tech' }])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tech', { schema: 'board' })
    return queryInterface.bulkDelete('boards', { id: 'tech' })
  },
}
