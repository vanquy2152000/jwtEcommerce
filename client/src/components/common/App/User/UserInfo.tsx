import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { AntDesignOutlined, UploadOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Form, Input, Row, Typography, Upload, UploadProps, message, notification } from 'antd'
import { postUploadAvatar, putUpdateUser } from '../../../../service/userApi';
import { doUpdateUserInfoAction, doUploadAvatarAction } from '../../../../redux/account/accountSlice';
import { useForm } from 'antd/es/form/Form';
import '../../../../scss/custom-button.scss'
import { IUpdateUser } from '../../../../types/user';
import { escape } from 'lodash';

type Props = {}

const UserInfo = (props: Props) => {
    const user = useSelector((state: any) => state.account.user)
    const dispatch = useDispatch()
    const [tempAvatar, setTempAvatar] = useState<string>('')
    const [form] = useForm()

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${tempAvatar || user.avatar}`

    const handleUploadAvatar = async ({ file, onSuccess, onError }: any) => {
        const res = await postUploadAvatar(file)

        if (res && res.data) {
            const newAvatar = res.data.fileUploaded
            dispatch(doUploadAvatarAction(newAvatar))
            setTempAvatar(newAvatar)
        } else {
            onError('Đã có lỗi xảy ra khi upload!')
        }
    }

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadAvatar,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const onFinishUpdate = async () => {
        await form.validateFields()
        const updateUserPayload: IUpdateUser = {
            fullName: form.getFieldValue('fullName'),
            phone: form.getFieldValue('phone'),
            _id: form.getFieldValue('id'),
            avatar: tempAvatar,
        }
        const fullName = form.getFieldValue('fullName')
        const phone = form.getFieldValue('phone')

        const res = await putUpdateUser(updateUserPayload)

        if (res && res.data) {
            dispatch(doUpdateUserInfoAction({ avatar: tempAvatar, phone, fullName }))
            message.success('Cập nhật thông tin cá nhân thành công')
            localStorage.removeItem('access_token')
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
    }

    useEffect(() => {
        if (user) {
            form.setFieldValue('email', user.email)
            form.setFieldValue('fullName', user.fullName)
            form.setFieldValue('phone', user.phone)
            form.setFieldValue('id', user.id)
        }
    }, [form])


    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col md={12} sm={24}>
                    <Row gutter={[20, 20]} >
                        <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar
                                size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                                icon={<AntDesignOutlined />}
                                shape='circle'
                                src={urlAvatar}
                                style={{ textAlign: 'center' }}
                            />
                        </Col>
                        <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                            </Upload>
                        </Col>
                    </Row>
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
                            label={<Typography.Text>Tên hiển thị: </Typography.Text>}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Tên hiển thị không được để trống!' }]}
                            name='fullName'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<Typography.Text>Số điện thoại</Typography.Text>}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                            name='phone'
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                            <Button htmlType='button' onClick={onFinishUpdate} className='btn-add' >
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default UserInfo