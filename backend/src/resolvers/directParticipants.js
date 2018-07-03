import Bluebird from 'bluebird'
import * as Utils from '../utils'

export default _ => {
  const { participants } = _
  return Bluebird.map(participants, p => Utils.cache.getCachedIdentity(p))
}
