'use strict'
let koaRrr = require('../..')
let startServer = require('../support/testServer')
let fetch = require('node-fetch')
let create = require('redux').createStore

let routes = require('../support/routes')

function fakeReducer () {}

describe('rrr middleware', () => {
  let server

  function start (middleware) {
    server = startServer(5050, middleware)
  }

  afterEach((done) => {
    if (server) {
      server.close(done)
    }
    done()
  })
  it('should render react', (done) => {
    let middleware = koaRrr({
      routes: routes,
      template: (html) => `<html><body>${html}</body></html>`,
      createStore: jasmine.createSpy('createStore').and.callFake(() => create(fakeReducer))
    })
    start(middleware)
    fetch('http://localhost:5050/').then((response) => {
      expect(response.status).toEqual(200)
    })
      .catch(done.fail)
      .then(done)
  })
})
