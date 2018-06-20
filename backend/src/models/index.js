import Sequelize from 'sequelize'
import boardBootstrap from './_bootstrapboards'
import config from '../config'

export const db = new Sequelize(config('pg_url'), {
  operatorsAliases: false,
  logging: process.env.NODE_ENV !== 'PRODUCTION',
})

export const Boards = {}
export const Board = db.import('./Board')
const init = async () => {
  const initboards = await boardBootstrap()
  initboards.forEach(({ board, model }) => {
    Boards[board.id] = model
  })
}

init()
