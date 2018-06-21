export default (sequelize, DataTypes) =>
  sequelize.define(
    'identity',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      board: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      authentication: {
        type: DataTypes.ENUM('anonymous', 'account'),
        defaultValue: 'anonymous',
        allowNull: false,
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('now'),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: false,
    }
  )
