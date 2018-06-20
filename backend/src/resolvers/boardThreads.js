import * as Models from '../models'

export default async (_, { board, page = 1 }) => {
  if (Models.Boards[board] === undefined || page < 1) {
    return null
  }

  return Models.db.models[board].findAll({
    where: {
      parent: null,
    },
    attributes: ['id'],
    order: [['id', 'DESC']],
    limit: 10,
    offset: (page - 1) * 10,
  })
}
