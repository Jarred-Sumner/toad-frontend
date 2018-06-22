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
export const Account = db.import('./Account')
export const EmailToken = db.import('./EmailToken')

Session.hasMany(Identity, { foreignKey: 'session_id' })
Identity.belongsTo(Session, { foreignKey: 'session_id' })
Account.hasMany(Identity, { foreignKey: 'account_id' })
Identity.belongsTo(Account, { foreignKey: 'account_id' })
Account.hasMany(Session, { foreignKey: 'account_id' })
Session.belongsTo(Account, { foreignKey: 'account_id' })
Board.hasMany(Identity, { foreignKey: 'board' })
EmailToken.belongsTo(Account, { foreignKey: 'account_id' })
Account.hasMany(EmailToken, { foreignKey: 'account_id' })
EmailToken.belongsTo(Session, { foreignKey: 'session_id' })
Session.hasMany(EmailToken, { foreignKey: 'session_id' })

const init = async () => {
  const initboards = await boardBootstrap()
  initboards.forEach(({ board, model }) => {
    Boards[board.id] = model
  })
  await Account.sync()
  await EmailToken.sync()
  await Session.sync()
  await Identity.sync()
}

init()
