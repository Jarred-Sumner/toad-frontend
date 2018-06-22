export default (sequelize, DataTypes) => {
  const Attachment = sequelize.define(
    'attachment',
    {
      type: {
        type: DataTypes.ENUM('file'),
        defaultValue: 'file',
        allowNull: false,
      },
      mimetype: DataTypes.STRING,
      board: DataTypes.STRING,
      filename: DataTypes.STRING,
      url: DataTypes.TEXT,
      identity_id: DataTypes.UUID,
    },
    {
      underscored: true,
    }
  )
  Attachment.associate = models => {
    models.identity.hasMany(Attachment, { foreignKey: 'identity_id' })
    Attachment.belongsTo(models.identity, { foreignKey: 'identity_id' })
  }
  return Attachment
}
