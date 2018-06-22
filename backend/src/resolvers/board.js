import { Op } from 'sequelize'
import { isObject, isNumber } from 'lodash'
import moment from 'moment'
import * as Models from '../models'
import * as Utils from '../utils'

const findOrCreateIdentity = async ({ boardId, sessionId, accountId }) => {
  const existingSearch = {
    session_id: sessionId,
    board: boardId,
    account_id: accountId,
    expires_at: {
      [Op.gt]: moment().toISOString(),
    },
  }
  if (isNumber(existingSearch.account_id)) {
    delete existingSearch.session_id
  }
  const existing = await Models.Identity.findOne({ where: existingSearch })
  if (isObject(existing)) {
    return existing
  }
  return Models.Identity.create({
    name: Utils.namegen(),
    board: boardId,
    session_id: sessionId,
    account_id: accountId,
    expires_at: moment()
      .add(24, 'hours')
      .toISOString(), // update with correct date calc
  })
}

export default async (_, { id }, { session }) => {
  if (Models.Boards[id] === undefined) {
    return null
  }

  if (!isObject(session)) {
    return null
  }

  const identity = await findOrCreateIdentity({
    boardId: id,
    sessionId: session.id,
    accountId: session.account_id,
  })

  return {
    id,
    identity,
  }
}
