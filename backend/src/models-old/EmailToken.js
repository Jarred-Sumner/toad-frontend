export default (sequelize, DataTypes) =>
  sequelize.define(
    'email_token',
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
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_valid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('now'),
        allowNull: false,
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
