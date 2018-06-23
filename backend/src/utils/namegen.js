import { random as randomEmoji } from 'node-emoji'
import { random } from 'lodash'

export default () => {
  const name = `${random(99, 999)}:${randomEmoji().key}:`
  return name
}
