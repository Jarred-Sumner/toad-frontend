import moment from 'moment'
import nanoid from 'nanoid'
import Storage from '@google-cloud/storage'

const storage = new Storage({
  projectId: 'toads-208000',
  keyFilename: 'src/google_credentials.json',
})
const bucket = storage.bucket('toad-uploads')

export default async ({ contentType }) => {
  const filename = nanoid()
  const file = bucket.file(filename)
  const url = await file.getSignedUrl({
    action: 'write',
    expires: moment().add(1, 'day'),
    contentType,
  })
  return {
    url: url[0],
    canonicalUrl: `https://storage.cloud.google.com/toad-uploads/${filename}`,
  }
}
