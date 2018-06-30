import { Op } from 'sequelize'
import moment from 'moment'
import { isObject } from 'lodash'
import Models from '../models'

export default async ({ id }) => {
  const existing = await Models.conversation.findOne({
    where: {
      board: id,
      type: 'board_conversation',
      expiry_date: {
        [Op.gt]: new Date(),
      },
    },
  })
  if (isObject(existing)) {
    return existing
  }

  return Models.conversation.create({
    board: id,
    type: 'board_conversation',
    expiry_date: moment().add(1, 'day'),
  })
}
