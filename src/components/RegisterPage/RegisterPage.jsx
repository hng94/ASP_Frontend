import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../actions';
import {
  Form, Icon, Input, Button,
} from 'antd';
import './RegisterPage.scss';

class RegisterForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {email, password, name} = values;
        if (email && password && name) {
          const user = {
            email,
            password,
            name,
            id: null
          }
          dispatch(userActions.register(user));
        }
      }
    });

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="register-form">
        <h1>Trollo</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: 'Please input your name!' }
              ],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                {type: 'email', message: 'The input is not valid E-mail!',},
                { required: true, message: 'Please input your email!' }
              ],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
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
            <Button type="primary" htmlType="submit" className="register-form-button">
              Register
            </Button>
            Or <a href="/login">Login now!</a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const RegisterPage = Form.create()(connect()(RegisterForm));

export default RegisterPage;