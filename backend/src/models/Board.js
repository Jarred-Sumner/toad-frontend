export default (sequelize, DataTypes) =>
  sequelize.define(
    'board',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING,
      },
      created_at: { type: DataTypes.DATE, defaultValue: sequelize.fn('now') },
    },
    {
      createdAt: 'created_at',
      updatedAt: false,
    }
  )
