import * as Utils from '../utils'

export default (_, args, { session }) => Utils.cache.getIdentityFromSession({
    session_id: session.id,
    conversation_id: _.id,
  })
