import { get, isNull, isObject } from 'lodash'
import nanoid from 'nanoid'
import Models from './models'

export default async (req, res) => {
  const existing = get(req, 'cookies.toads_session', null)

  // Validate existing cookie, if there is one.
  if (!isNull(existing)) {
    const session = await Models.session.findOne({
      where: { token: existing, is_valid: true },
      attributes: [
        'id',
        'token',
        'authentication',
        'account_id',
        'created_at',
        'updated_at',
      ],
    })
    if (isObject(session)) {
      res.cookie('toads_session', existing)
      return res.json({ toads_session: existing })
    }
  }

  const token = nanoid(64)
  const { clientIp, headers } = req
  await Models.session.create({
    token,
    source_ip: clientIp,
    user_agent: headers['user-agent'],
  })
  res.cookie('toads_session', token)
  res.status(201)
  res.json({ toads_session: token })
}
