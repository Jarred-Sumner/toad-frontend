import { isObject } from 'lodash'
import Models from '../models'
import * as Utils from '../utils'

export const validatePost = async (
  { id, identity },
  { parent_id, body, attachment_id },
  { session }
) => {
  let foundParent
  // verify that we can reply to the parent
  if (parent_id !== undefined) {
    foundParent = await Models[id].findOne({
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
      },
    })
    if (!attachment) {
      return null
    }

    // generate metadata
    const dim = await Utils.imageDimensions(attachment.url)
    if (!dim) {
      return null
    }

    attachment.metadata = dim
    attachment.metadata.size = dim.length
    delete attachment.metadata.length
    await attachment.save()
  } else if (parent_id === undefined) {
    return null // Don't allow OPs without attachment
  }

  const post = {
    parent: parent_id,
    attachment_id,
    body,
    identity_id: identity.id,
  }

  return { post, foundParent }
}

export default async (_, args, ctx) => {
  const { id } = _
  const validation = await validatePost(_, args, ctx)

  if (!isObject(validation)) {
    return null
  }

  const { post, foundParent } = validation

  const bumped_at = post.parent_id === undefined ? new Date() : null

  const newPost = await Models[id].create({
    bumped_at,
    ...post,
  })

  const postWithData = await Models[id].findOne({
    where: { id: newPost.id },
  })

  // bump op if we're replying
  if (foundParent) {
    foundParent.bumped_at = new Date()
    foundParent.save()
  }

  return postWithData
}
