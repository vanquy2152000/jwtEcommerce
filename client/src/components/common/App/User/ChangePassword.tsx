import { AntDesignOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, Row, Typography, message, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { IChangePassword } from '../../../../types/user';
import { postChangePassword } from '../../../../service/userApi';

type Props = {}

const ChangePassword = (props: Props) => {
  const [form] = useForm()
  const user = useSelector((state: any) => state.account.user)
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`

  useEffect(() => {
    if (user) {
      form.setFieldValue('email', user.email)
    }
  }, [form])

  const onFinishUpdatePassword = async () => {

    await form.validateFields()
    const changePasswordPayload: IChangePassword = {
      email: form.getFieldValue('email'),
      oldpass: form.getFieldValue('oldpass'),
      newpass: form.getFieldValue('newpass'),
    }

    const res = await postChangePassword(changePasswordPayload)
    console.log(res)

    if (res && res.data) {
      message.success('Đổi mật khẩu thành công')
      form.setFieldValue('oldpass', '')
      form.setFieldValue('newpass', '')
    } else {
      notification.error({
        message: 'Đã có lỗi xảy ra khi thay đổi mật khẩu',
        description: res.message
      })
    }
  }

  return (
    <Row gutter={[20, 20]}>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Avatar
          size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
          icon={<AntDesignOutlined />}
          shape='circle'
          src={urlAvatar}
          style={{ textAlign: 'center' }}
        />
      </Col>

      <Col md={12} sm={24}>
        <Form form={form}>
          <Form.Item
            label={<Typography.Text>Id: </Typography.Text>}
            labelCol={{ span: 24 }}
            name='id'
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<Typography.Text>Email: </Typography.Text>}
            labelCol={{ span: 24 }}
            name='email'
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={<Typography.Text>Mật khẩu hiện tại: </Typography.Text>}
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
            name='oldpass'
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={<Typography.Text>Mật khẩu mới: </Typography.Text>}
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
            name='newpass'
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={<Typography.Text>Nhập lại mật khẩu mới: </Typography.Text>}
            name="confirmNewPassword"
            dependencies={['newpass']}
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newpass') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không đúng!'));
                },
              }),
            ]}
            labelCol={{ span: 24 }}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <Button htmlType='button' onClick={onFinishUpdatePassword} className='btn-add' >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default ChangePassword