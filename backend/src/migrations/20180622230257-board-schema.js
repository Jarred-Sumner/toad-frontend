export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS board;'),
  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.query('DROP SCHEMA board CASCADE'),
}
