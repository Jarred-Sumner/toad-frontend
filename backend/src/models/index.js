import Sequelize from 'sequelize'
import boardBootstrap from './_bootstrapboards'
import config from '../config'

export const db = new Sequelize(config('pg_url'), {
  operatorsAliases: false,
  logging: process.env.NODE_ENV !== 'PRODUCTION',
})

export const Boards = {}
export const Board = db.import('./Board')
export const Session = db.import('./Session')
export const Identity = db.import('./Identity')

Session.hasMany(Identity, { foreignKey: 'session_id' })
Identity.belongsTo(Session, { foreignKey: 'session_id' })
Board.hasMany(Identity, { foreignKey: 'board' })

const init = async () => {
  const initboards = await boardBootstrap()
  initboards.forEach(({ board, model }) => {
    Boards[board.id] = model
  })
  await Session.sync()
  await Identity.sync()
}

init()
