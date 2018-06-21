import nanoid from 'nanoid'
import { isObject } from 'lodash'
import * as Models from '../models'
import * as Utils from '../utils'

export default async (_, { email }, { session }) => {
  if (!isObject(session)) {
    return null
  }
  const account = await Models.Account.findOrCreate({ where: { email } })
  // generate login token
  const emailToken = await Models.EmailToken.create({
    token: nanoid(64),
    account_id: account[0].id,
    session_id: session.id,
  })

  await Utils.email({ token: emailToken.token, destination: email })
  return true
}
