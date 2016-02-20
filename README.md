Koa-RRR
=======

An opinionated Koa middleware for React/React-router/Redux.

## Installation

```
npm i --save koa-rrr
```

## Usage

```js
let app = koa()
let routes = (
  <Router history={history}>
    <Route path='/page1' component={PageOne} />
  </Router>
)

let koaRrr = require('koa-rrr')
let initStore = require('./initStore')

app.use(koaRrr({
  routes,
  createStore: initStore,
  template: html => `<html><body>${html}</body></html>`
}))
```

## API

koaRrr(options) -> Middleware
Returns a koa middleware that will render a react app using react-router and redux

### Options

#### routes [ReactRouter|function] Required

Either static routes, or a function taking the redux store and returning routes

#### createStore [function] Required

A function that creates the redux store

#### template [function] Required

A function taking the rendered react markup, and returning the complete html for the page

#### wrap [function] Optional

A function that will wrap your react app prior to rendering. This is used if you have `Provider` type components that must be provided at the root of the app. The default version is equivalent to

```js
let Provider = require('react-redux').Provider
function wrap(routingContext, store) {
  return <Provider store={store}><routingContext /></Provider>
}
```
