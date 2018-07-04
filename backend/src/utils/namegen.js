import Chance from 'chance'

import { sample, random, times } from 'lodash'
import { random as randomEmoji } from 'node-emoji'

const chance = new Chance()

const genders = ['male', 'female']
const getGender = () => sample(genders)

const randomColonEmoji = () => `:${randomEmoji().key}:`

const genName = () => {
  const gender = getGender()
  const showSuffix = random(1, 5) === 1
  const nationality = random(1, 10) === 1 ? 'it' : 'en'
  const middleInitial = random(1, 100) >= 98
  return `${chance.name({
    gender,
    suffix: showSuffix,
    middle_initial: middleInitial,
    nationality,
  })} ${randomColonEmoji()}${randomColonEmoji()}`
}
export default genName
