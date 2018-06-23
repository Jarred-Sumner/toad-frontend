import Models from '../models'

export default thread => {
  const board = thread.board || thread._modelOptions.name.singular
  const threadId = thread.id
  return Models.db.models[board].count({ where: { parent: threadId } })
}
