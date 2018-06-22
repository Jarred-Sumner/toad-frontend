export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('boards', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      label: {
        type: Sequelize.STRING,
      },
      color_scheme: {
        type: Sequelize.ENUM(
          'blue',
          'purple_red',
          'pink',
          'slate',
          'red',
          'green'
        ),
        defaultValue: 'blue',
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('boards'),
}
