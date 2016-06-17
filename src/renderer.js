'use strict'
let React = require('react')
let ReactDOMServer = require('react-dom/server')
let Router = require('react-router')
let Provider = require('react-redux').Provider

function pmatch (options) {
  return new Promise((resolve, reject) => {
    Router.match(options, (error, redirectLocation, renderProps) => {
      if (error) {
        return reject(error)
      }
      if (redirectLocation) {
        return resolve({
          action: 'redirect',
          location: redirectLocation
        })
      }
      return resolve({
        action: 'render',
        props: renderProps
      })
    })
  })
}

function normalizeRoutes (routes, store) {
  if (typeof routes === 'function') {
    return routes(store)
  }
  return routes
}

function defaultWrap (context, store) {
  return React.createElement(Provider, {store: store},
    context)
}

module.exports = function (options) {
  let wrap = options.wrap || defaultWrap
  return function * () {
    let store = options.createStore()
    let routes = normalizeRoutes(options.routes, store)
    let renderResponse = yield pmatch({routes: routes, location: this.request.url})
    if (renderResponse.action === 'redirect') {
      return this.redirect(renderResponse.location.pathname)
    }
    if (!renderResponse.props) {
      this.throw(404)
    }
    let context = React.createElement(Router.RouterContext, renderResponse.props)
    let wrapped = wrap(context, store)
    let html = ReactDOMServer.renderToString(wrapped)
    this.body = options.template(html, store.getState())
  }
}
