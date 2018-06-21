import { Op } from 'sequelize'
import * as Models from '../models'

export default async thread => {
  console.log(thread)
  // fix this soon by a stronger board reference
  const board = thread.board || thread._modelOptions.name.singular
  const threadId = thread.id
  const limit = thread.showall ? null : 3
  return Models.db.models[board].findAll({
    where: {
      [Op.or]: [{ id: threadId, parent: null }, { parent: thread.id }],
    },
    limit,
  })
}
