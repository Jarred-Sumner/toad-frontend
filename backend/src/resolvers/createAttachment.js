import Models from '../models'
import * as Utils from '../utils'

const mimes = {
  imagegif: 'image/gif',
  imagejpeg: 'image/jpeg',
  imagepng: 'image/png',
  videomp4: 'video/mp4',
  videowebm: 'video/webm',
}

export default async ({ id, identity }, { mimetype, filename }) => {
  const contentType = mimes[mimetype]
  const signed = await Utils.uploadurl({ contentType })
  const attachment = await Models.attachment.create({
    type: 'file',
    mimetype: contentType,
    board: id,
    filename,
    url: signed.canonicalUrl,
    identity_id: identity.id,
  })

  return { signed_url: signed.url, id: attachment.id }
}
