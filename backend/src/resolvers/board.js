import { Op } from 'sequelize'
import { isObject, isNumber, isNull, get } from 'lodash'
import moment from 'moment'
import boardConversation from './boardConversation'
import Models from '../models'
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
  const existing = await Models.identity.findOne({
    where: existingSearch,
  })
  if (isObject(existing)) {
    return existing
  }
  return Models.identity.create({
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
  const board = get(Models, `Boards[${id}]`, null)
  if (isNull(board)) {
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

  const boardConvo = await boardConversation({ id })
  const sessionConvo = await Models.session_conversations.findOrCreate({
    where: {
      session_id: session.id,
      conversation_id: boardConvo.id,
      identity_id: identity.id,
    },
  })

  return {
    identity,
    board_conversation: {
      ...sessionConvo[0].dataValues,
      ...boardConvo.dataValues,
    },
    ...board.dataValues,
  }
}
