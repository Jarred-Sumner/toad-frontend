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
      createdAt: { type: DataTypes.DATE, defaultValue: sequelize.fn('now') },
    },
    {
      updatedAt: false,
    }
  )
