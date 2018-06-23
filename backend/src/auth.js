import { get, isNull, isObject } from 'lodash'
import Models from './models'

export default async (req, res, next) => {
  const token = get(req, 'cookies.toads_session', null)
  if (isNull(token)) {
    res.status(401)
    return res.json({ error: 'Missing session cookie.' })
  }
  const session = await Models.session.findOne({ where: { token } })

  if (!isObject(session)) {
    res.status(401)
    return res.json({ error: 'Session cookie is expired or invalid.' })
  }
  req.session = session
  next()
}
