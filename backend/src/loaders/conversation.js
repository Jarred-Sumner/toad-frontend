import bluebird from 'bluebird'
import { Op } from 'sequelize'
import Models from '../models'

export default ids =>
  bluebird.map(ids, id =>
    Models.conversation.findOne({
      where: { id },
      attributes: ['id', 'type', 'board', 'participants'],
      include: [
        {
          model: Models.session_conversations,
          where: { session_id: session.id },
          attributes: ['participation_status'],
          required: false,
        },
      ],
    })
  )
