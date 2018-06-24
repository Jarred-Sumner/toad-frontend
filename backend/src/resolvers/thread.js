import Models from '../models'

export default async (context, { id }) => {
  const board = context.id
  const post = await Models[board].findOne({
    where: { id, parent: null },
  })
  if (post) {
    return { ...post.dataValues, showall: true, board }
  }
  return null
}
