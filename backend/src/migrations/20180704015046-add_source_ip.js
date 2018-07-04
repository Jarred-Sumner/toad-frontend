export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sessions', 'source_ip', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    return queryInterface.addColumn('sessions', 'user_agent', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  },
  down: async queryInterface => {
    await queryInterface.removeColumn('sessions', 'source_ip')
    return queryInterface.removeColumn('sessions', 'user_agent')
  },
}
