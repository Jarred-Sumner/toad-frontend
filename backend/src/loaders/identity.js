import bluebird from 'bluebird'
import * as Utils from '../utils'

export default ids => bluebird.map(ids, Utils.cache.getCachedIdentity)
