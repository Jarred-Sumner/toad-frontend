import { isObject } from 'lodash'
import Models from '../models'
import { validatePost } from './createPost'
import { pubsub } from '../resolverDefinition'

export default async (_, args, ctx) => {
  const board = _.id
  const validation = await validatePost(_, args, ctx)

  if (!isObject(validation)) {
    return null
  }

  const topic = `NewBoardMessage.${board}`

  const { post } = validation
  const inserted = await Models.chat_message.create({ ...post, board })
  const withData = await Models.chat_message.findOne({
    where: { id: inserted.id },
  })

  pubsub.publish(topic, { NewBoardMessage: withData })

  return withData
}
