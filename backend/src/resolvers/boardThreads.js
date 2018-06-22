import * as Models from '../models'

export default async ({ id }, { page = 1 }) => {
  if (page < 1) {
    return null
  }

  return Models.db.models[id].findAll({
    where: {
      parent: null,
    },
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
    order: [['id', 'DESC']],
    limit: 10,
    offset: (page - 1) * 10,
  })
}
