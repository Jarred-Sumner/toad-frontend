import * as Models from '../models'
import * as Utils from '../utils'

const mimes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/webm',
]

export default async ({ id, identity }, { mimetype, filename }) => {
  if (mimes.indexOf(mimetype) === -1) {
    return null
  }
  const signed = await Utils.uploadurl({ contentType: mimetype })
  const attachment = await Models.Attachment.create({
    type: 'file',
    mimetype,
    board: id,
    filename,
    url: signed.canonicalUrl,
    identity_id: identity.id,
  })

  return { signed_url: signed.url, id: attachment.id }
}
