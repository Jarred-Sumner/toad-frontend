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
      color_scheme: {
        type: DataTypes.ENUM(
          'blue',
          'purple_red',
          'pink',
          'slate',
          'red',
          'green'
        ),
        defaultValue: 'blue',
        allowNull: false,
      },
      created_at: { type: DataTypes.DATE, defaultValue: sequelize.fn('now') },
    },
    {
      createdAt: 'created_at',
      updatedAt: false,
    }
  )
