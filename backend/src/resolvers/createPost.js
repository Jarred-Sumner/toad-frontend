import { isString, isObject } from 'lodash'
import * as Models from '../models'

export default async ({ id, identity }, { parent_id, body, attachment_id }) => {
  // verify that we can reply to the parent
  if (isString(parent_id)) {
    const foundParent = await Models.db.models[id].findOne({
      where: {
        id: parent_id,
        parent: null,
      },
    })
    if (!isObject(foundParent)) {
      return null
    }
  }

  if (isString(attachment_id)) {
    const attachment = await Models.Attachment.findOne({
      where: {
        id: attachment_id,
        identity_id: identity.id,
        board: id,
      },
    })
    if (!isObject(attachment)) {
      return null
    }
  } else if (isString(parent_id)) {
    return null // Don't allow OPs without attachment
  }

  return Models.db.models[id].create({
    parent_id,
    attachment_id,
    body,
    identity_id: identity.id,
  })
}
