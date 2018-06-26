import Models from '../models'

export default async ({ id }, { offset = null, limit = 25 }) => {
  const lim = limit <= 25 ? limit : 25
  const messages = await Models.chat_message.findAll({
    where: {
      board: id,
    },
    order: [['id', 'desc']],
    offset,
    limit: lim,
  })
  return { messages }
}
