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
export const Attachment = db.import('./Attachment')

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
Identity.hasMany(Attachment, { foreignKey: 'identity_id' })
Attachment.belongsTo(Identity, { foreignKey: 'identity_id' })

const init = async () => {
  await db.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')
  const initboards = await boardBootstrap()
  await Account.sync()
  await Session.sync()
  await EmailToken.sync()
  await Identity.sync()
  await Attachment.sync()

  initboards.forEach(b => {
    const { board, model } = b
    Boards[board.id] = b
    Identity.hasMany(model, { foreignKey: 'identity_id' })
    model.belongsTo(Identity, { foreignKey: 'identity_id' })
    Attachment.hasMany(model, { foreignKey: 'attachment_id' })
    model.belongsTo(Attachment, { foreignKey: 'attachment_id' })
    model.sync()
  })
}

init()
