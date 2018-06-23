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
        type: Sequelize.ENUM('file'),
        defaultValue: 'file',
        allowNull: false,
      },
      mimetype: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      filename: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.TEXT,
      },
      session_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sessions',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('attachments'),
}
