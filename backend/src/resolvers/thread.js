import * as Models from '../models'

export default async (context, { id }) => {
  const board = context.id

  const post = await Models.db.models[board].findOne({
    where: { id, parent: null },
  })
  if (post) {
    return { id: post.id, showall: true, board }
  }
  return null
}
