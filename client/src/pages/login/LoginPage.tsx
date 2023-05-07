import './Login.scss'
import { Button, Divider, Form, Input, Layout, Typography, message, notification } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { loginUser } from '../../service/authApi'
import { useDispatch } from 'react-redux'
import { doLoginUser } from '../../redux/account/accountSlice'
import { useState } from 'react'


const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState<boolean>(false)

    const onFinish = async (values: any) => {
        setLoading(true)
        const res = await loginUser(values)
        console.log(res)

        if (res && res.data) {
            localStorage.setItem('access_token', res?.data?.access_token)
            dispatch(doLoginUser(res.data.user))
            message.success('Đăng nhập thành công')
            navigate('/')
            setLoading(false)
        } else {
            setTimeout(() => {
                setLoading(false)
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description:
                        res && Array.isArray(res) ? res[0] : res,
                    duration: 5,
                })
            }, 2000)
        }
    }

    return (
        <Layout className="login-container" >
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
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
                    <Input size="large" placeholder="Email" prefix={<UserOutlined />} />
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
                        loading={loading}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
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