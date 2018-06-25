export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('chat_messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      identity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'identities',
          key: 'id',
        },
      },
      attachment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'attachments',
          key: 'id',
        },
      },
      board: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'boards',
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
    }),
  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('chat_messages'),
}
