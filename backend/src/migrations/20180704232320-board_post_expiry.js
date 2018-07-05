export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn(
      {
        tableName: 'tech',
        schema: 'board',
      },
      'expires_at',
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    ),
  down: queryInterface =>
    queryInterface.removeColumn(
      {
        tableName: 'tech',
        schema: 'board',
      },
      'expires_at'
    ),
}
