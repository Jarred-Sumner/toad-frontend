import Models from '../models'

export default async ({ id }, { page = 1 }) => {
  if (page < 1) {
    return null
  }

  return Models[id].findAll({
    where: {
      parent: null,
    },
    include: [
      {
        model: Models.identity,
        attributes: ['id', 'name'],
      },
      {
        model: Models.attachment,
        attributes: ['id', 'type', 'mimetype', 'filename', 'url'],
      },
    ],
    order: [['bumped_at', 'DESC']],
    limit: 10,
    offset: (page - 1) * 10,
  })
}
