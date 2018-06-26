import base64 from 'urlsafe-base64'
import crypto from 'crypto'
import moment from 'moment'
import config from '../config'

const bucket = config('google_bucket_id')
const cdnHostname = config('cdn_hostname')
const cdnKey = Buffer.from(config('cdn_key'), 'base64')
const cdnKeyName = config('cdn_key_name')

export default ({ url }) => {
  if (cdnKey === '') {
    return url
  }
  const contentUrl = url.replace(
    `storage.googleapis.com/${bucket}`,
    cdnHostname
  )
  const expiry = moment()
    .add(1, 'year')
    .format('X')

  const urlToSign = `${contentUrl}?Expires=${expiry}&KeyName=${cdnKeyName}`
  const hashBuffer = crypto
    .createHmac('sha1', cdnKey)
    .update(urlToSign)
    .digest()
  const signature = base64.encode(hashBuffer)

  return `${urlToSign}&Signature=${signature}`
}
