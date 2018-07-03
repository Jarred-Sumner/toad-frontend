export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('session_conversations')
    return queryInterface.addColumn('session_conversations', 'identity_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'identities',
        key: 'id',
      },
    })
  },
  down: queryInterface =>
    queryInterface.removeColumn('session_conversations', 'identity_id'),
}
