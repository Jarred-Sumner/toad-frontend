import { Op } from 'sequelize'
import Models from '../models'

export default ({ board, id }) =>
  Models.identity.findAll({
    where: {
      board,
    },
    attributes: ['id', 'name'],
    include: [
      {
        model: Models.session_conversations,
        attributes: [],
        where: {
          conversation_id: id,
          participation_status: {
            [Op.or]: ['explicit_opt_in', 'auto'],
          },
        },
        required: true,
      },
    ],
  })
