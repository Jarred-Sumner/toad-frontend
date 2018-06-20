import * as Models from '../models'

export default async (_, { board, id }) => {
  if (Models.Boards[board] === undefined) {
    return null
  }

  const post = await Models.db.models[board].findOne({
    where: { id, parent: null },
  })
  if (post) {
    return { id: post.id, showall: true, board }
  }
  return null
}
