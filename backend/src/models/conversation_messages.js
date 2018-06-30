export default (sequelize, DataTypes) => {
  const session_conversations = sequelize.define(
    'session_conversations',
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
  session_conversations.associate = models => {
    models.conversation.hasMany(session_conversations, {
      foreignKey: 'conversation_id',
    })
    session_conversations.belongsTo(models.conversation, {
      foreignKey: 'conversation_id',
    })

    models.identity.hasMany(session_conversations, {
      foreignKey: 'identity_id',
    })
    session_conversations.belongsTo(models.identity, {
      foreignKey: 'identity_id',
    })

    models.attachment.hasMany(session_conversations, {
      foreignKey: 'attachment_id',
    })
    session_conversations.belongsTo(models.attachment, {
      foreignKey: 'attachment_id',
    })

    session_conversations.addScope(
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
  return session_conversations
}
