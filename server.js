/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer } = require('http')
// eslint-disable-next-line n/no-deprecated-api
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const { join } = require('path')
const moment = require('moment')

const isDev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'

// when using middleware `hostname` and `port` must be provided below
const app = next({ isDev, hostname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      fs.appendFile(join(process.cwd(), 'logs', `log_${moment(new Date()).format('YYYYMMDD')}.out`), err)
      res.end('internal server error')
    }
  })
    .listen(process.env.PORT, (err) => {
      if (err) throw err
      process.send('ready')
      console.log(`> Ready on http://${hostname}:${process.env.PORT}`)
    })
    .on('error', (event) => {
      fs.appendFile(join(process.cwd(), 'logs', `log_${moment(new Date()).format('YYYYMMDD')}.out`), event.stack)
    })
})
