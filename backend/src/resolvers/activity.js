import { Op } from 'sequelize'
import { clone, isEqual } from 'lodash'
import { pubsub } from '../resolverDefinition'
import Models from '../models'
import * as Utils from '../utils'

const previousStatuses = {}

const getIdentities = async (board, ids) => {
  const previous = clone(previousStatuses[board])

  const activeIdentities = ids || (await Utils.presence.getVisible(board))
  const identities = await Models.identity.findAll({
    where: { id: { [Op.in]: activeIdentities } },
  })

  const response = {
    active_count: identities.length,
    active_identities: identities,
  }

  if (!isEqual(activeIdentities, previous)) {
    pubsub.publish(`BoardActivity.${board}`, { BoardActivity: response })
  }

  previousStatuses[board] = activeIdentities

  return response
}

export const activityMutation = async ({ id, identity }, { visible }) => {
  const utilFunction = visible
    ? Utils.presence.setVisible
    : Utils.presence.setInactive

  const currentIds = await utilFunction({
    board: id,
    identity_id: identity.id,
  })

  const response = await getIdentities(id, currentIds)
  return response
}

export default ({ id }) => getIdentities(id)
