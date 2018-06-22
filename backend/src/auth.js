import nanoid from 'nanoid'
import { get, isString, isObject } from 'lodash'
import config from './config'
import Models from './models'

export default async (req, res, next) => {
  let token = get(req, 'cookies.session', null)
  let session

  if (!isString(token)) {
    token = nanoid(64)
    session = await Models.session.create({ token })
    res.cookie('session', token, {
      domain: config('origin'),
      httpOnly: true,
    })
  } else {
    session = await Models.session.findOne({ where: { token } })
  }

  if (!isObject(session)) {
    return next()
  }
  req.session = session
  next()
}
