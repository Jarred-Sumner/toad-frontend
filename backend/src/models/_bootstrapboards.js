import Sequelize from 'sequelize'
import { Board, db } from './index'

export default async () => {
  await Board.sync()
  await db.query('CREATE SCHEMA IF NOT EXISTS board;')
  const boards = await Board.findAll()
  return boards.map(board => {
    let model = db.define(
      board.id,
      {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        parent: { type: Sequelize.INTEGER, allowNull: true },
        body: { type: Sequelize.TEXT },
        createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      },
      {
        createdAt: 'createdAt',
        updatedAt: false,
        freezeTableName: true,
      }
    )
    model = model.schema('board').sync()
    return { board, model }
  })
}
