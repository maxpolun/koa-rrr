import React from 'react'
import {Router, Route} from 'react-router'

class Hello extends React.Component {
  render () {
    return <h1>Hello!</h1>
  }
}

module.exports = <Router>
  <Route path='/' component={Hello} />
</Router>
