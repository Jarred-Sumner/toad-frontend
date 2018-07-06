export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('session_conversations', 'visibility', {
      type: Sequelize.ENUM('open', 'minimize', 'dismiss'),
      defaultValue: 'open',
      allowNull: false,
    })

    return queryInterface.addColumn('session_conversations', 'toggled_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
      allowNull: false,
    })
  },
  down: async queryInterface => {
    await queryInterface.removeColumn('session_conversations', 'visibility')
    return queryInterface.removeColumn('session_conversations', 'toggled_at')
  },
}
