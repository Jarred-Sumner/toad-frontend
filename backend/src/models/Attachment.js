export default (sequelize, DataTypes) =>
  sequelize.define(
    'attachment',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('file'),
        defaultValue: 'file',
        allowNull: false,
      },
      mimetype: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      board: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      identity_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('now'),
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: false,
    }
  )
