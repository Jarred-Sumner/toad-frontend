import Sequelize from 'sequelize'
import { Board, db } from './index'

export default async () => {
  await Board.sync()
  await db.query('CREATE SCHEMA IF NOT EXISTS board;')
  const boards = await Board.findAll()
  return boards.map(board => {
    const model = db.define(
      board.id,
      {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        parent: { type: Sequelize.INTEGER, allowNull: true },
        body: { type: Sequelize.TEXT },
        created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      },
      {
        createdAt: 'created_at',
        updatedAt: false,
        freezeTableName: true,
        schema: 'board',
      }
    )
    model.sync()
    return { board, model }
  })
}
