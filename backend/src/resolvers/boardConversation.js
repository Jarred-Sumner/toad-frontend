import { Op } from 'sequelize'
import moment from 'moment'
import Models from '../models'

export default async ({ id }) => {
  const convo = await Models.conversation.findOrCreate({
    where: {
      board: id,
      type: 'board_conversation',
      expiry_date: {
        [Op.gt]: new Date(),
      },
    },
    defaults: {
      expiry_date: moment().add(1, 'day'),
    },
  })
  return convo[0]
}
