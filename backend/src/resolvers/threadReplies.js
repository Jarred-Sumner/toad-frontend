import { Op } from 'sequelize'
import * as Models from '../models'

export default async thread => {
  // fix this soon by a stronger board reference
  const board = thread.board || thread._modelOptions.name.singular
  const limit = thread.showall ? null : 3
  return Models.db.models[board].findAll({
    where: {
      parent: thread.id,
    },
    order: [['id', 'ASC']],
    limit,
    include: [
      {
        model: Models.Identity,
        attributes: ['id', 'name'],
      },
      {
        model: Models.Attachment,
        attributes: ['id', 'type', 'mimetype', 'filename', 'url'],
      },
    ],
  })
}
