import { Op } from 'sequelize'
import Models from '../models'

export default async ({ id }, { page = 1 }) => {
  if (page < 1) {
    return null
  }

  return Models[id].findAll({
    where: {
      parent: null,
      expires_at: {
        [Op.gt]: Models.sequelize.fn('now'),
      },
    },
    order: [['bumped_at', 'DESC']],
    limit: 10,
    offset: (page - 1) * 10,
  })
}
