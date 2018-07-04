import { get, isNull, isObject } from 'lodash'
import cookie from 'cookie'
import Models from './models'

export const wsAuth = async (params, socket) => {
  const req = socket.upgradeReq
  const cookies = cookie.parse(get(req, 'headers.cookie'), '')
  const token = get(cookies, 'toads_session', null)
  if (isNull(token)) {
    return {}
  }
  const session = await Models.session.findOne({
    where: { token, is_valid: true },
    attributes: [
      'id',
      'token',
      'authentication',
      'account_id',
      'created_at',
      'updated_at',
    ],
  })
  if (!isObject(session)) {
    return {}
  }
  return { session }
}

export default async (req, res, next) => {
  const token = get(req, 'cookies.toads_session', null)
  if (isNull(token)) {
    res.status(401)
    return res.json({ error: 'Missing session cookie.' })
  }
  const session = await Models.session.findOne({
    where: { token, is_valid: true },
    attributes: [
      'id',
      'token',
      'authentication',
      'account_id',
      'created_at',
      'updated_at',
    ],
  })

  if (!isObject(session)) {
    res.status(401)
    return res.json({ error: 'Session cookie is expired or invalid.' })
  }
  req.session = session
  next()
}
