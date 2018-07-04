import { clone, isEqual } from 'lodash'
import { pubsub } from '../resolverDefinition'
import * as Utils from '../utils'

const previousStatuses = {}

const getIdentities = async ({ board }, args, { loaders }) => {
  const previous = clone(previousStatuses[board])
  const idLoader = loaders.identity
  const activityLoader = loaders.boardActivity

  const activeIdentities = await activityLoader.load(board)
  const identities = await idLoader.loadMany(activeIdentities)

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

export const activityMutation = async ({ id, identity }, { visible }, ctx) => {
  const utilFunction = visible
    ? Utils.presence.setVisible
    : Utils.presence.setInactive

  const activityLoader = ctx.loaders.boardActivity

  const currentIds = await utilFunction({
    board: id,
    identity_id: identity.id,
  })

  activityLoader.prime(id, currentIds)

  const response = await getIdentities({ board: id }, { visible }, ctx)
  return response
}

export default ({ id }, args, ctx) => getIdentities({ board: id }, args, ctx)
