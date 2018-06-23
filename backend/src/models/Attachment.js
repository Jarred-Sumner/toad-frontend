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
      filename: DataTypes.STRING,
      url: DataTypes.TEXT,
      session_id: DataTypes.INTEGER,
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
        allowNull: true,
      },
    },
    {
      underscored: true,
    }
  )
  Attachment.associate = models => {
    models.session.hasMany(Attachment, { foreignKey: 'session_id' })
    Attachment.belongsTo(models.session, { foreignKey: 'session_id' })
  }
  return Attachment
}
