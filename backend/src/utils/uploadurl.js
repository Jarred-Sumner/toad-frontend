import moment from 'moment'
import nanoid from 'nanoid'
import Storage from '@google-cloud/storage'
import config from '../config'

const storage = new Storage({
  projectId: config('google_project_id'),
  keyFilename: config('google_application_credentials'),
})
const bucket = storage.bucket(config('google_bucket_id'))

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
    canonicalUrl: `https://storage.googleapis.com/${config(
      'google_bucket_id'
    )}/${filename}`,
  }
}
