import { get, isString } from 'lodash'
import * as Models from './models'

export default async (req, res, next) => {
  const token = get(req, 'headers.authorization', null)
  if (!isString(token)) {
    return next()
  }

  const session = await Models.Session.findOne({ where: { token } })
  req.session = session
  next()
}
