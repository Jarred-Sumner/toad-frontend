export default (sequelize, DataTypes) =>
  sequelize.define(
    'session',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('now'),
        allowNull: false,
      },
      is_valid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      authentication: {
        type: DataTypes.ENUM('anonymous', 'account'),
        defaultValue: 'anonymous',
        allowNull: false,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ['token'],
        },
      ],
    }
  )
