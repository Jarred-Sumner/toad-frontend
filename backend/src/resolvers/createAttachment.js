import Models from '../models'
import * as Utils from '../utils'

const mimes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/webm',
]

export default async (_, { mimetype, filename }, { session }) => {
  if (mimes.indexOf(mimetype) === -1) {
    return null
  }
  const signed = await Utils.uploadurl({ contentType: mimetype })
  const attachment = await Models.attachment.create({
    type: 'file',
    mimetype,
    filename,
    url: signed.canonicalUrl,
    session_id: session.id,
  })

  return { signed_url: signed.url, id: attachment.id }
}
