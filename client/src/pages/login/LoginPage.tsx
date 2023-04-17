import React from 'react'
import './Login.scss'
import { Button, Divider, Form, Input, Layout, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'


const LoginPage = () => {
    return (
        <Layout className="login-container" >
            <Form
                name="basic"
                initialValues={{ remember: true }}
                // onFinish={onFinish}
                autoComplete="off"
                className="login-form"
            >
                <Typography.Title level={2} style={{ textAlign: "center" }}>Đăng nhập</Typography.Title>
                <Divider />
                <Form.Item
                    wrapperCol={{ span: 22 }}
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
                >
                    <Input size="large" placeholder="Username" prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ span: 22 }}
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập password!' }]}
                >
                    <Input.Password
                        visibilityToggle={true}
                        size="large"
                        placeholder="Password"
                        prefix={<LockOutlined />}
                    />
                </Form.Item>

                <Form.Item >
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="btn-login"
                    // loading={loadings[1]} 
                    >
                        login
                    </Button>
                </Form.Item>
                <Typography.Text strong >
                    <span>Bạn chưa có tài khoản? </span>
                    <Link to={'/register'} style={{ textDecoration: 'underline' }}>
                        Register
                    </Link>
                </Typography.Text>
            </Form>
        </Layout >
    )
}

export default LoginPage