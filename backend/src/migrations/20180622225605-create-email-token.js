export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('email_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.STRING,
      },
      account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'accounts',
          key: 'id',
        },
      },
      session_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sessions',
          key: 'id',
        },
      },
      is_valid: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('email_tokens'),
}
