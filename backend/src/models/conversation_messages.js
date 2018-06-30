export default (sequelize, DataTypes) => {
  const conversation_messages = sequelize.define(
    'conversation_messages',
    {
      body: { type: DataTypes.TEXT, allowNull: true },
      identity_id: DataTypes.UUID,
      attachment_id: DataTypes.INTEGER,
      conversation_id: DataTypes.UUID,
    },
    {
      underscored: true,
    }
  )
  conversation_messages.associate = models => {
    models.conversation.hasMany(conversation_messages, {
      foreignKey: 'conversation_id',
    })
    conversation_messages.belongsTo(models.conversation, {
      foreignKey: 'conversation_id',
    })

    models.identity.hasMany(conversation_messages, {
      foreignKey: 'identity_id',
    })
    conversation_messages.belongsTo(models.identity, {
      foreignKey: 'identity_id',
    })

    models.attachment.hasMany(conversation_messages, {
      foreignKey: 'attachment_id',
    })
    conversation_messages.belongsTo(models.attachment, {
      foreignKey: 'attachment_id',
    })

    conversation_messages.addScope(
      'defaultScope',
      {
        include: [
          { model: models.identity, attributes: ['id', 'name'] },
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
  return conversation_messages
}
