import { random as randomEmoji } from 'node-emoji'
import { random } from 'lodash'

export default () => {
  const name = `:${randomEmoji().key}: ${random(99, 999)}`
  return name
}
