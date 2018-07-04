import faker from 'faker'
import { random as randomEmoji } from 'node-emoji'

const randomColonEmoji = () => `:${randomEmoji().key}:`

export default () =>
  faker.fake(
    `{{name.firstName}} {{name.lastName}}, {{name.suffix}} ${randomColonEmoji()}${randomColonEmoji()}`
  )
