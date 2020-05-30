import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button } from 'antd';
import HomeLayout from '../layouts/HomeLayout';
import UserApi from '../api/user'

const Login = (props) => {
  let api = new UserApi()
  const onFinish = values => {
    console.log('Success:', values);
    let login = api.login(values)
    login.then((result) => {
      if (result.data) {
        localStorage.setItem('token-key', JSON.stringify(result.data));
        props.history.push("/");
      } else {
        alert(result.msg)
      }
    })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const form = (
    <Form
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
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
    <HomeLayout title="Welcome">
      <div className="site-layout-content">
        <h1>用户登录</h1>
        {form}
      </div>
    </HomeLayout>
  );
};

export default Login