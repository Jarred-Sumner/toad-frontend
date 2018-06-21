import nanoid from 'nanoid'
import * as Utils from '../utils'
import * as Models from '../models'

export default async () => {
  const session = await Models.Session.create({
    token: nanoid(64),
  })

  return session.token
}
