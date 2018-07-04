import bluebird from 'bluebird'
import * as Utils from '../utils'

export default boards => bluebird.map(boards, Utils.presence.getVisible)
