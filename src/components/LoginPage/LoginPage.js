import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../actions';
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';
import './LoginPage.scss';

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {email, password} = values;
        if (email && password) {
          dispatch(userActions.login(email, password));
        }
      }
    });

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-form">
        <h1>Trollo</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <a href="/register">register now!</a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const LoginPage = Form.create()(connect()(NormalLoginForm));

export default LoginPage;