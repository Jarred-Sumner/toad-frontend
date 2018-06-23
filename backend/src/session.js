import nanoid from 'nanoid'
import Models from './models'

export default async (req, res, next) => {
  const token = nanoid(64)
  await Models.session.create({ token })

  res.json({ toads_session: token })
}
