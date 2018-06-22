export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'accounts',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        email: {
          type: Sequelize.STRING,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        indexes: [
          {
            unique: true,
            fields: ['email'],
          },
        ],
      }
    )
    return queryInterface.addIndex('accounts', {
      unique: true,
      fields: ['email'],
    })
  },
  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('accounts', {
      cascade: true,
    }),
}
