import deo from 'deo'

// make sure to set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for aws
export default deo({
  port: '3420',
  origin: 'localhost:5000',
  hostname: 'http://localhost:5000',
  google_application_credentials: 'src/google_credentials.json',
  redis_host: 'localhost',
  redis_port: '6379',
})
