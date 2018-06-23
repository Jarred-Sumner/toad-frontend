import { Op } from 'sequelize'
import Models from '../models'

export default async thread => {
  // fix this soon by a stronger board reference
  const board = thread.board || thread._modelOptions.name.singular
  const limit = thread.showall ? null : 3
  const order = thread.showall ? 'ASC' : 'DESC'
  const results = await Models[board].findAll({
    where: {
      parent: thread.id,
    },
    order: [['id', order]],
    limit,
    include: [
      {
        model: Models.identity,
        attributes: ['id', 'name'],
      },
      {
        model: Models.attachment,
        attributes: ['id', 'type', 'mimetype', 'filename', 'url', 'metadata'],
      },
    ],
  })

  if (!thread.showall) {
    results.reverse()
  }
  return results
}
