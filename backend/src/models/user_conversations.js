export default (sequelize, DataTypes) => {
  const user_conversations = sequelize.define(
    'user_conversations',
    {
      session_id: DataTypes.INTEGER,
      conversation_id: DataTypes.UUID,
      participation_status: {
        type: DataTypes.ENUM('auto', 'explicit_opt_in', 'declined', 'expired'),
        defaultValue: 'auto',
        allowNull: false,
      },
    },
    { underscored: true }
  )
  user_conversations.associate = models => {
    user_conversations.belongsTo(models.session, {
      foreign_key: 'session_id',
    })
    models.session.hasMany(user_conversations, {
      foreign_key: 'session_id',
    })

    models.conversation.hasMany(user_conversations, {
      foreignKey: 'conversation_id',
    })
    user_conversations.belongsTo(models.conversation, {
      foreignKey: 'conversation_id',
    })
  }
  return user_conversations
}
