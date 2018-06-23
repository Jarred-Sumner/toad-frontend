export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('attachments', 'metadata', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('attachments', 'metadata'),
}
