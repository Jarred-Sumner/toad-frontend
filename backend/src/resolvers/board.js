import { Op } from 'sequelize'
import { isObject } from 'lodash'
import moment from 'moment'
import * as Models from '../models'
import * as Utils from '../utils'

const findIdentity = ({ boardId, sessionId }) =>
  Models.Identity.findOne({
    where: {
      session_id: sessionId,
      board: boardId,
      expires_at: {
        [Op.gt]: moment().toISOString(),
      },
    },
  })

const createIdentity = ({ boardId, sessionId }) =>
  Models.Identity.create({
    name: Utils.namegen(),
    board: boardId,
    session_id: sessionId,
    expires_at: moment()
      .add(24, 'hours')
      .toISOString(), // update with correct date calc
  })

export default async (_, { id }, { session }) => {
  if (Models.Boards[id] === undefined) {
    return null
  }

  if (!isObject(session)) {
    return null
  }

  const foundIdentity = await findIdentity({
    boardId: id,
    sessionId: session.id,
  })
  if (isObject(foundIdentity)) {
    return { id, identity: foundIdentity }
  }

  const identity = await createIdentity({ boardId: id, sessionId: session.id })
  return {
    id,
    identity,
  }
}
