import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import NoIntrospection from 'graphql-disable-introspection'
import { graphqlExpress } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import session from './session'
import auth from './auth'
import schema from './schema'

const PORT = process.env.PORT || 3000

const app = express()
console.log(`toad-backend ${GIT_COMMIT}`)
console.log(`Listening on :${PORT}`)

const corsOptions = {
  origin: ['http://localhost:3000', 'https://toads.app'],
}

app.options('*', cors(corsOptions))
app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(cookieParser())

app.post('/session', session)
app.use('/graphql', auth)
app.use('/healthz', (req, res) => res.json({ error: false }))

const production = process.env.NODE_ENV === 'PRODUCTION'

const Introspection = production ? NoIntrospection : () => true
const isPretty = !production
app.post(
  '/graphql',
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
