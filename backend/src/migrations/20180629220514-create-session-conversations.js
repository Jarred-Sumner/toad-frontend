export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('session_conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sessions',
          key: 'id',
        },
      },
      conversation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id',
        },
      },
      participation_status: {
        type: Sequelize.ENUM('auto', 'explicit_opt_in', 'declined', 'expired'),
        defaultValue: 'auto',
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
    return queryInterface.addIndex('session_conversations', {
      unique: true,
      fields: ['session_id', 'conversation_id'],
    })
  },
  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('session_conversations'),
}
