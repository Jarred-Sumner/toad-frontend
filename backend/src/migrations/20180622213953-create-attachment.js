export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('attachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      mimetype: {
        type: Sequelize.STRING,
      },
      board: {
        type: Sequelize.STRING,
      },
      filename: {
        type: Sequelize.STRING,
      },
      filename: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.TEXT,
      },
      identity_id: {
        type: Sequelize.UUID,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('attachments'),
}
