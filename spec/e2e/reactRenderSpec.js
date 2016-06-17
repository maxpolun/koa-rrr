'use strict'
let koaRrr = require('../..')
let startServer = require('../support/testServer')
let fetch = require('node-fetch')
let create = require('redux').createStore

let routes = require('../support/routes')

function fakeReducer (state = {}) {
  return {}
}

describe('rrr middleware', () => {
  let server, storeSpy, defaultOptions

  function start (middleware) {
    server = startServer(5050, middleware)
  }

  function expectPromiseToResolve (promise, done) {
    promise
      .catch(done.fail)
      .then(done)
  }

  function middlewareWithDefaults (options = {}) {
    options = Object.assign({}, defaultOptions, options)
    return koaRrr(options)
  }

  beforeEach(() => {
    storeSpy = jasmine.createSpy('createStore')
    storeSpy.and.callFake(() => create(fakeReducer))
    defaultOptions = {
      routes,
      template: (html) => `<html><body>${html}</body></html>`,
      createStore: storeSpy
    }
  })

  afterEach((done) => {
    if (server) {
      server.close(done)
    }
    done()
  })

  it('should render react', (done) => {
    let middleware = middlewareWithDefaults()
    start(middleware)
    expectPromiseToResolve(fetch('http://localhost:5050/').then((response) => {
      expect(response.status).toEqual(200)
    }), done)
  })

  it('should return html', (done) => {
    let middleware = middlewareWithDefaults()
    start(middleware)
    expectPromiseToResolve(fetch('http://localhost:5050/').then((response) => {
      return response.text()
    }).then((html) => {
      expect(html).toMatch('<html><body><h1[^>]+>Hello!</h1></body></html>')
    }), done)
  })

  it('can take different templates', (done) => {
    let middleware = middlewareWithDefaults({
      template: (html) => `<html><head></head><body>${html}</body></html>`
    })
    start(middleware)
    expectPromiseToResolve(fetch('http://localhost:5050/').then((response) => {
      return response.text()
    }).then((html) => {
      expect(html).toMatch('<html><head></head><body><h1[^>]+>Hello!</h1></body></html>')
    }), done)
  })

  it('passes the redux state to the template', (done) => {
    let middleware = middlewareWithDefaults({
      template: (html, state) => `<html><head></head><body>${html}<script>window.__REDUX_STORE__=${JSON.stringify(state)}</script></body></html>`
    })
    start(middleware)
    expectPromiseToResolve(fetch('http://localhost:5050/').then((response) => {
      return response.text()
    }).then((html) => {
      expect(html).toMatch('<script>window.__REDUX_STORE__={}</script>')
    }), done)
  })

  it('should create the redux store', (done) => {
    let middleware = middlewareWithDefaults()
    start(middleware)
    expectPromiseToResolve(fetch('http://localhost:5050/').then(() => {
      expect(storeSpy).toHaveBeenCalled()
    }), done)
  })

  it('does an http redirect when there is a react redirect', (done) => {
    let middleware = middlewareWithDefaults()
    start(middleware)
    expectPromiseToResolve(fetch('http://localhost:5050/redir').then((response) => {
      expect(response.url).toEqual('http://localhost:5050/logout')
    }), done)
  })

  it('can handle a function for routes', (done) => {
    let routesFn = jasmine.createSpy('routes').and.returnValue(routes)
    let middleware = middlewareWithDefaults({routes: routesFn})
    start(middleware)
    expectPromiseToResolve(fetch('http://localhost:5050/').then((response) => {
      expect(routesFn).toHaveBeenCalled()
    }), done)
  })

  it('should 404 on missing route', (done) => {
    let middleware = middlewareWithDefaults()
    start(middleware)
    expectPromiseToResolve(fetch('http://localhost:5050/this/doesnt/exist').then((response) => {
      expect(response.status).toEqual(404)
    }), done)
  })

  it('should call the wrapper function', (done) => {
    let wrapperSpy = jasmine.createSpy('wrap').and.callFake((x) => x)
    let middleware = middlewareWithDefaults({
      wrap: wrapperSpy
    })
    start(middleware)
    expectPromiseToResolve(fetch('http://localhost:5050').then((response) => {
      expect(wrapperSpy).toHaveBeenCalled()
    }), done)
  })
})
