import deo from 'deo'

// make sure to set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for aws
export default deo({
  pg_url: 'postgresql://toads@localhost/toads',
})
