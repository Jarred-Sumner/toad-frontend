export default (sequelize, DataTypes) => {
  const session = sequelize.define(
    'session',
    {
      token: DataTypes.STRING,
      is_valid: DataTypes.BOOLEAN,
      authentication: DataTypes.STRING,
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      underscored: true,
    }
  )
  session.associate = models => {
    models.account.hasMany(models.account, { foreignKey: 'account_id' })
    session.belongsTo(models.account, { foreignKey: 'account_id' })
    // associations can be defined here
  }
  return session
}
