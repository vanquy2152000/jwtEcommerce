import { Link, useNavigate } from 'react-router-dom'
import './RegisterPage.scss'
import { Layout, Form, Input, Button, Typography, Divider, message, notification } from 'antd'
import { useState } from 'react'
import { registerUser } from '../../service/authApi'

const RegisterPage = () => {
    const [loadings, setLoadings] = useState<boolean[]>([])

    const navigate = useNavigate()

    const enterLoading = (index: number) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        setTimeout(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 1000);
    };

    const onFinish = async (values: any) => {
        enterLoading(1)
        const res = await registerUser(values)

        if (res?.data?._id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res && Array.isArray(res) ? res[0] : res,
                duration: 5
            })
        }
    }

    return (
        <Layout className="register-container" >
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                className="register-form"
            >
                <Typography.Title level={2} style={{ textAlign: "center" }}>Đăng kí tài khoản</Typography.Title>
                <Divider />
                <Form.Item
                    label={<Typography.Text strong>Full Name </Typography.Text>}
                    labelCol={{ span: 24 }}
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập full name!' }]}
                    labelAlign="right"
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item
                    label={<Typography.Text strong>Email </Typography.Text>}
                    labelCol={{ span: 24 }}
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    labelAlign="right"
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item
                    label={<Typography.Text strong>Phone </Typography.Text>}
                    labelCol={{ span: 24 }}
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    labelAlign="right"
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item
                    label={<Typography.Text strong>Password </Typography.Text>}
                    labelCol={{ span: 24 }}
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập password!' }]}

                >
                    <Input.Password
                        visibilityToggle={true}
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="btn-register"
                        loading={loadings[1]}
                    >
                        Đăng kí
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <Typography.Text strong>
                    <span>Bạn đã có tài khoản? </span>
                    <Link to={'/login'} style={{ textDecoration: 'underline' }}>
                        Login
                    </Link>
                </Typography.Text>

            </Form>
        </Layout >
    )
}

export default RegisterPage