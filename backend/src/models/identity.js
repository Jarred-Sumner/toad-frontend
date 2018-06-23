export default (sequelize, DataTypes) => {
  const Identity = sequelize.define(
    'identity',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize.fn('gen_random_uuid'),
      },
      name: DataTypes.STRING,
      board: DataTypes.STRING,
      account_id: DataTypes.INTEGER,
      session_id: DataTypes.INTEGER,
      expires_at: DataTypes.DATE,
    },
    {
      underscored: true,
    }
  )
  Identity.associate = models => {
    Identity.belongsTo(models.account, { foreign_key: 'account_id' })
    Identity.belongsTo(models.session, { foreign_key: 'session_id' })
    models.session.hasMany(Identity, { foreign_key: 'session_id' })
    models.account.hasMany(Identity, { foreign_key: 'account_id' })
  }
  return Identity
}
