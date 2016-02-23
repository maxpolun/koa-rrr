'use strict'
let koaRrr = require('../..')
let startServer = require('../support/testServer')
let fetch = require('node-fetch')
let create = require('redux').createStore

let routes = require('../support/routes')

function fakeReducer () {}

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
})
