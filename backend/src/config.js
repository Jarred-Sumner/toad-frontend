import deo from 'deo'

// make sure to set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for aws
export default deo({
  origin: 'localhost:5000',
  hostname: 'http://localhost:5000',
})
