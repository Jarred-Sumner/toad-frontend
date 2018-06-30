import { Op } from 'sequelize'

export default (sequelize, DataTypes) => {
  const Board = sequelize.define(
    'board',
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      label: { type: DataTypes.STRING },
      color_scheme: {
        type: DataTypes.ENUM(
          'blue',
          'purple_red',
          'pink',
          'slate',
          'red',
          'green'
        ),
        defaultValue: 'blue',
        allowNull: false,
      },
      created_at: { type: DataTypes.DATE, defaultValue: sequelize.fn('now') },
    },
    { underscored: true }
  )
  Board.associate = models => {
    // associations can be defined here
  }
  return Board
}
