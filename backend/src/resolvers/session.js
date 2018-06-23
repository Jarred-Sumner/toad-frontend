import nanoid from 'nanoid'
import { isString, isObject } from 'lodash'
import Models from '../models'

export default async (_, { email_token }) => {
  const sessionOptions = { token: nanoid(64) }
  if (isString(email_token)) {
    const emailToken = await Models.email_token.findOne({
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
      await Models.identity.update(
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
    } else {
      return null
    }
  }
  const session = await Models.session.create(sessionOptions)

  return session.token
}
