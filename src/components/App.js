/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Router, Route } from 'react-router-dom'
import Board from './Board/Board'
import { connect } from 'react-redux'
import { history } from '../helpers'
import { PrivateRoute } from './PrivateRoute/PrivateRoute'
import Home from './Home/Home'
import LoginPage from './LoginPage/LoginPage'
import RegisterPage from './RegisterPage/RegisterPage'

class App extends Component {
  render () {
    const { alert } = this.props

    return (
      <>
        {alert.message &&
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        }
        <Router history={history}>
          <div>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/boards/:boardId/" component={Board} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
          </div>
        </Router>
      </>
    )
  }
}

const mapStateToProps = state => ({ alert: state.alert })

export default connect(mapStateToProps)(App)
