export default (sequelize, DataTypes) => {
  const email_token = sequelize.define(
    'email_token',
    {
      token: DataTypes.STRING,
      account_id: DataTypes.INTEGER,
      session_id: DataTypes.INTEGER,
      is_valid: DataTypes.BOOLEAN,
    },
    {
      underscored: true,
    }
  )
  email_token.associate = models => {
    models.account.hasMany(email_token, { foreignKey: 'account_id' })
    email_token.belongsTo(models.account, { foreignKey: 'account_id' })
    models.session.hasMany(email_token, { foreignKey: 'session_id' })
    email_token.belongsTo(models.session, { foreignKey: 'session_id' })
  }
  return email_token
}
