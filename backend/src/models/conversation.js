export default (sequelize, DataTypes) => {
  const conversation = sequelize.define(
    'conversation',
    {
      board: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('board_conversation', 'direct_conversation'),
        allowNull: false,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      participants: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
      },
    },
    {
      underscored: true,
    }
  )

  return conversation
}
