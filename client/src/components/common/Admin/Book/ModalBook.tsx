import { Col, Form, Input, Modal, Row, Typography, message, notification } from 'antd'
import { postAddBook, putUpdateBook } from '../../../../service/bookApi'
import { IBooks } from '../../../../types/book'
import { useForm } from 'antd/es/form/Form'
import '../../../../scss/custom-button.scss'
import { useEffect, useState } from 'react';

type Props = {
    openModal: boolean
    actionModal: string
    dataBookDetail?: IBooks
    handleSaveModalBook: () => void
    handleCloseModalBook: () => void
}

const ModalBook = ({ openModal, actionModal, dataBookDetail, handleSaveModalBook, handleCloseModalBook }: Props) => {
    const [form] = useForm();
    const [loadings, setLoadings] = useState<boolean[]>([])

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

    const handleSaveModal = async () => {
        await form.validateFields()
        // const addPayload: IAddBook = {
        //     fullName: form.getFieldValue('fullName'),
        //     password: form.getFieldValue('password'),
        //     email: form.getFieldValue('email'),
        //     phone: form.getFieldValue('phone')
        // }

        // const updatePayload: IUpdateBook = {
        //     fullName: form.getFieldValue('fullName'),
        //     _id: form.getFieldValue('_id'),
        //     phone: form.getFieldValue('phone'),
        //     avatar: ' '
        // }
        enterLoading(1)
        if (actionModal === 'CREATE') {
            // const res = await postAddBook(addPayload)

            // if (res && res.data) {
            //     message.success('Tạo người dùng thành công')
            //     form.resetFields()
            //     handleSaveModalBook()
            // } else {
            //     notification.error({
            //         message: 'Đã có lỗi xảy ra',
            //         description: res.message
            //     })
            // }
        }
        if (actionModal === 'UPDATE') {
            // const res = await putUpdateBook(updatePayload)
            // console.log(res)
            // if (res && res.data) {
            //     message.success('Cập nhật người dùng thành công')
            //     handleSaveModalBook()
            // } else {
            //     notification.error({
            //         message: 'Đã có lỗi xảy ra',
            //         description: res.message
            //     })
            // }
        }
    }

    useEffect(() => {
        if (actionModal === 'CREATE') {
            form.resetFields()
        }
        if (actionModal === 'UPDATE') {
            if (dataBookDetail) {
                form.setFieldValue('_id', dataBookDetail._id)
            }
        }
    }, [actionModal, openModal, dataBookDetail])


    return (
        <Modal
            title={<Typography.Title level={4} style={{ margin: 0 }}>Thêm mới người dùng</Typography.Title>}
            width={500}
            open={openModal}
            onOk={handleSaveModal}
            onCancel={handleCloseModalBook}
            okText={actionModal === 'CREATE' ? 'Tạo mới' : 'Cập nhật'}
            cancelText='Hủy'
            okButtonProps={{ className: 'btn-ok-modal' }}
            cancelButtonProps={{ className: 'btn-cancel-modal' }}
            confirmLoading={loadings[1]}
            forceRender
        >
            <Form form={form}>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            hidden
                            label={<Typography.Text >Id</Typography.Text>}
                            labelCol={{ span: 24 }}
                            name='_id'
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            hidden
                            label={<Typography.Text >Avatar</Typography.Text>}
                            labelCol={{ span: 24 }}
                            name='avatar'
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={<Typography.Text >Tên hiển thị</Typography.Text>}
                            rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                            labelCol={{ span: 24 }}
                            name='fullName'
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    {
                        actionModal === 'CREATE' ?
                            (
                                <Col span={24}>
                                    <Form.Item
                                        label={<Typography.Text >Password</Typography.Text>}
                                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                        labelCol={{ span: 24 }}
                                        name='password'
                                    >
                                        <Input.Password visibilityToggle={true} />
                                    </Form.Item>
                                </Col>
                            ) : (null)
                    }
                    <Col span={24}>
                        <Form.Item
                            label={<Typography.Text >Email</Typography.Text>}
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            labelCol={{ span: 24 }}
                            name='email'

                        >
                            <Input disabled={actionModal === 'UPDATE' ? true : false} />
                        </Form.Item>

                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={<Typography.Text >Số điện thoại</Typography.Text>}
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            labelCol={{ span: 24 }}
                            name='phone'
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalBook