import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, Alert } from 'antd';
import HomeLayout from '../layouts/HomeLayout';
import UserApi from '../api/user'

const Login = (props) => {
  let api = new UserApi()
  const [error, setError] = useState({
    isShow: false,
    message: ''
  });
  const onFinish = values => {
    let login = api.login(values)
    login.then((result) => {
      if (result.data) {
        localStorage.setItem('token-key', JSON.stringify(result.data));
        props.history.push("/");
      } else {
        setError({
          isShow: true,
          message: result.msg
        })
      }
    })
  };

  const form = (
    <Form
      name="basic"
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <HomeLayout title="用户登录">
      <div className="site-layout-content">
        <h1>用户登录</h1>
        {error.isShow &&
          <Alert message={error.message} type="error" />
        }
        {form}
      </div>
    </HomeLayout>
  );
};

export default Login