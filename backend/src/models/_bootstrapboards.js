import Sequelize from 'sequelize'
import { Board, Identity, db } from './index'

export default async () => {
  await Board.sync()
  await db.query('CREATE SCHEMA IF NOT EXISTS board;')
  const boards = await Board.findAll()
  return boards.map(board => {
    const model = db.define(
      board.id,
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        parent: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        body: { type: Sequelize.TEXT },
        identity_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        attachment_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now'),
        },
      },
      {
        createdAt: 'created_at',
        updatedAt: false,
        freezeTableName: true,
        schema: 'board',
      }
    )
    return { board, model }
  })
}
