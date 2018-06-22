import Models from '../models'

export default async ({ id, identity }, { parent_id, body, attachment_id }) => {
  // verify that we can reply to the parent
  if (parent_id !== undefined) {
    const foundParent = await Models.db.models[id].findOne({
      where: {
        id: parent_id,
        parent: null,
      },
    })
    if (!foundParent) {
      return null
    }
  }

  if (attachment_id !== undefined) {
    const attachment = await Models.attachment.findOne({
      where: {
        id: attachment_id,
        identity_id: identity.id,
        board: id,
      },
    })
    if (!attachment) {
      return null
    }
  } else if (parent_id === undefined) {
    return null // Don't allow OPs without attachment
  }

  return Models.db.models[id].create({
    parent: parent_id,
    attachment_id,
    body,
    identity_id: identity.id,
  })
}
