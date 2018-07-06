import bluebird from 'bluebird'
import { Op } from 'sequelize'
import Models from '../models'

export default ids =>
  bluebird.map(ids, async sessionId => {
    const uc = await Models.conversation.findAll({
      where: {
        expiry_date: {
          [Op.gt]: Date.now(),
        },
      },
      include: [
        {
          model: Models.session_conversations,
          attributes: ['participation_status', 'visibility', 'toggled_at'],
          where: {
            session_id: sessionId,
            participation_status: {
              [Op.or]: ['explicit_opt_in', 'auto'],
            },
          },
          required: true,
        },
      ],
      raw: true,
    })
    const usersConversations = uc.map(c => ({
      ...c,
      participation_status: c['session_conversations.participation_status'],
      visibility: c['session_conversations.visibility'],
      toggled_at: c['session_conversations.toggled_at'],
    }))
    return usersConversations
  })
