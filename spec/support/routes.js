import React from 'react'
import {Router, Route, Redirect} from 'react-router'

class Hello extends React.Component {
  render () {
    return <h1>Hello!</h1>
  }
}

class Goodbye extends React.Component {
  render () {
    return <h1>Goodbye</h1>
  }
}

module.exports = <Router>
  <Route path='/' component={Hello} />
  <Route path='/logout' component={Goodbye} />
  <Redirect from='/redir' to='/logout' />
</Router>
