import nanoid from 'nanoid'
import { isString, isObject } from 'lodash'
import * as Models from '../models'

export default async (_, { email_token }) => {
  const sessionOptions = { token: nanoid(64) }
  if (isString(email_token)) {
    const emailToken = await Models.EmailToken.findOne({
      where: {
        token: email_token,
        is_valid: true,
      },
    })
    if (isObject(emailToken)) {
      // Invalidate the url
      emailToken.is_valid = false
      await emailToken.save()
      // Update any previous sessions to this account
      await Models.Identity.update(
        { account_id: emailToken.account_id },
        {
          where: {
            session_id: emailToken.session_id,
            account_id: null,
          },
        }
      )
      // Include account id in response
      sessionOptions.authentication = 'account'
      sessionOptions.account_id = emailToken.account_id
    }
  }

  const session = await Models.Session.create(sessionOptions)

  return session.token
}
