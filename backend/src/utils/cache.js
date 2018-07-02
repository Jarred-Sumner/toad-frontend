import { isObject, isNull, isString, get } from 'lodash'
import * as Utils from '../utils'
import Models from '../models'

const queryIdentity = ({ session_id, conversation_id }) =>
  Models.sequelize.query(
    `select i.id, i.name, i.board
from session_conversations sc
join identities i on (i.session_id = sc.session_id)
join conversations c on (c.id = sc.conversation_id)
where sc.session_id = :session_id
and i.board = c.board
and i.expires_at > now()
and sc.conversation_id = :conversation_id
limit 1`,
    {
      replacements: { session_id, conversation_id },
      type: Models.sequelize.QueryTypes.SELECT,
    }
  )

const getIdentityFromSession = async ({ session_id, conversation_id }) => {
  const key = `${conversation_id}-${session_id}`
  const cacheResult = await Utils.presence.redis.get(key)

  if (isString(cacheResult)) {
    let data
    try {
      data = JSON.parse(cacheResult)
    } catch (e) {
      data = null
    }
    if (isObject(data)) {
      return data
    }
  }

  const results = await queryIdentity({ session_id, conversation_id })
  const result = get(results, '[0]', null)
  if (isNull(result)) {
    return null
  }
  Utils.presence.redis.set(key, JSON.stringify(result))
  return result
}

export default { queryIdentity, getIdentityFromSession }
