export default (sequelize, DataTypes) => {
  const tech = sequelize.define(
    'tech',
    {
      parent: DataTypes.INTEGER,
      body: DataTypes.TEXT,
      identity_id: DataTypes.UUID,
      attachment_id: DataTypes.INTEGER,
      bumped_at: DataTypes.DATE,
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      underscored: true,
      schema: 'board',
      freezeTableName: true,
    }
  )
  tech.associate = models => {
    models.identity.hasMany(tech, { foreignKey: 'identity_id' })
    tech.belongsTo(models.identity, { foreignKey: 'identity_id' })
    models.attachment.hasMany(tech, { foreignKey: 'attachment_id' })
    tech.belongsTo(models.attachment, { foreignKey: 'attachment_id' })

    tech.addScope(
      'defaultScope',
      {
        include: [
          {
            model: models.identity,
            attributes: ['id', 'name'],
          },
          {
            model: models.attachment,
            attributes: [
              'id',
              'type',
              'mimetype',
              'filename',
              'url',
              'metadata',
            ],
          },
        ],
      },
      { override: true }
    )
  }
  return tech
}
