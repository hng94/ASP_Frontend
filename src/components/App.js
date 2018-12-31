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
import 'antd/dist/antd.css';
import { message } from 'antd';
import axios from 'axios';



class App extends Component {
  constructor(props) {
    super(props);
    const {user} = this.props;
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  }
  render () {
    const callMessage = (type, content) => {
      if (type === 'alert-success') {
        message.success(content);
      }
      else {
        message.error(content);
      }
    };
    const { alert } = this.props

    return (
      <>
        {alert.message && callMessage(alert.type, alert.message)}
        <Router history={history}>
          <div>
            <PrivateRoute key="home" exact path="/" component={Home} />
            <PrivateRoute key="board" exact path="/boards/:boardId/" component={Board} />
            <Route key="login" path="/login" component={LoginPage} />
            <Route key="register" path="/register" component={RegisterPage} />
          </div>
        </Router>
      </>
    )
  }
}

const mapStateToProps = state => ({ alert: state.alert, user: state.user })

export default connect(mapStateToProps)(App)
