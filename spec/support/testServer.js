module.exports = function startServer (port, middleware) {
  let koa = require('koa')
  let app = koa()

  app.use(middleware)

  return app.listen(port)
}
