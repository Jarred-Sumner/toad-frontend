import Models from '../models'

export default async (context, { id }) => {
  const board = context.id
  const post = await Models.db.models[board].findOne({
    where: { id, parent: null },
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
  })
  if (post) {
    return { ...post.dataValues, showall: true, board }
  }
  return null
}
