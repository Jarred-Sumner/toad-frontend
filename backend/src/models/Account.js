export default (sequelize, DataTypes) =>
  sequelize.define(
    'account',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
      },
      created_at: { type: DataTypes.DATE, defaultValue: sequelize.fn('now') },
    },
    {
      createdAt: 'created_at',
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  )
