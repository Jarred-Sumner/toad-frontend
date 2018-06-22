import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan'
import NoIntrospection from 'graphql-disable-introspection'
import { graphqlExpress } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import auth from './auth'
import schema from './schema'

const PORT = process.env.PORT || 3000

const app = express()
console.log(`toad-backend ${GIT_COMMIT}`)
console.log(`Listening on :${PORT}`)

app.use(logger('dev'))

app.use('*', auth)
app.use('/healthz', (req, res) => res.json({ error: false }))

const production = process.env.NODE_ENV === 'PRODUCTION'

const Introspection = production ? NoIntrospection : () => true
const isPretty = !production
app.post(
  '/',
  bodyParser.json(),
  graphqlExpress(req => {
    const { session } = req
    return {
      schema,
      pretty: isPretty,
      context: { session },
      validationRules: [depthLimit(10), Introspection],
      tracing: production,
      cacheControl: production,
    }
  })
)

app.listen(PORT)
