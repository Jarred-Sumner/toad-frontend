export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('conversations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('gen_random_uuid'),
      },
      board: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'boards',
          key: 'id',
        },
      },
      participants: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('board_conversation', 'direct_conversation'),
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
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
    queryInterface.dropTable('conversations'),
}
