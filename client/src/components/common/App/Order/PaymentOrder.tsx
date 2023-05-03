import { Button, Col, Divider, Empty, Form, Image, Input, InputNumber, Layout, Radio, Row, Typography, message, notification } from 'antd'
import './PaymentOrder.scss'
import '../../../../scss/custom-button.scss'
import { BiTrash } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { doDeleteCartAction, doPlaceOrderAction, doUpdateCartAction } from '../../../../redux/order/orderSlice'
import { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form'
import { IOrders } from '../../../../types/order'
import { postOrderBook } from '../../../../service/orderApi'

type Props = {
    setCurrentStep: any
}

const PaymentOrder = ({ setCurrentStep }: Props) => {
    const dispatch = useDispatch()
    const carts = useSelector((state: any) => state.order.carts)
    const user = useSelector((state: any) => state.account.user)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [valueOption, setValueOption] = useState<number>(1);

    const [form] = useForm()

    console.log(carts)

    const handleOnChangeInput = (value: any, book: any) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: book, _id: book._id }))
        }
    }

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((item: any) => {
                sum += item.quantity * item.detail.price
            })
            setTotalPrice(sum)
        } else {
            setTotalPrice(0)
        }
    }, [carts])
    useEffect(() => {
        form.setFieldValue('name', user.fullName)
        form.setFieldValue('phone', user.phone)
    }, [form])


    const onFinishPayment = async () => {
        const detailOrder = carts.map((item: any) => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id
            }
        })

        const orderPayload: IOrders = {
            name: form.getFieldValue('name'),
            phone: form.getFieldValue('phone'),
            address: form.getFieldValue('address'),
            totalPrice: totalPrice,
            detail: detailOrder
        }
        if (carts.length !== 0) {
            const res = await postOrderBook(orderPayload)

            if (res && res.data) {
                message.success('Đặt hàng thành công!')
                dispatch(doPlaceOrderAction())
                setCurrentStep(2)
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: res.message
                })
            }
        }
        if (carts.length === 0) {
            message.error('Không có sản phẩm sẽ chuyển về giỏ hàng')
            setCurrentStep(0)
        }
    }

    return (
        <>
            <Row gutter={[20, 20]} className='order-content'>
                <Col md={16} xs={24} className='order-left'>
                    {
                        carts.map((item: any) => {
                            const currentBookPrice = item?.detail?.price ?? 0
                            const sum = item.quantity * currentBookPrice

                            return (
                                <>
                                    <Col md={24} xs={24} className='order-content' key={item._id}>
                                        <Image
                                            style={{ minWidth: '100px', padding: 10 }}
                                            height={'100%'}
                                            preview={false}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`}
                                        />
                                        <Col span={6}>
                                            <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ margin: 0, minWidth: '50px' }} className="my-paragraph1">
                                                {item?.detail?.mainText}
                                            </Typography.Paragraph>
                                        </Col>
                                        <Col span={3} >
                                            {(item?.detail?.price).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                        </Col>
                                        <Col span={3} style={{ margin: 0, minWidth: '30px' }}>
                                            <InputNumber
                                                style={{ maxWidth: '100%' }}
                                                onChange={(value) => handleOnChangeInput(value, item)}
                                                value={item.quantity}
                                                disabled
                                            />
                                        </Col>
                                        <Col offset={3} span={3} style={{ paddingLeft: '30' }}>
                                            <span>Tổng : </span>
                                            {sum.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                        </Col>
                                        <Col offset={2} span={3} className='order-icon'>
                                            <BiTrash onClick={() => dispatch(doDeleteCartAction({ _id: item._id, quantity: item.quantity, detail: item }))} />
                                        </Col>
                                        <br />
                                    </Col>

                                </>
                            )
                        })}
                    {
                        carts.length === 0 &&
                        <div className='order-empty'>
                            <Empty description={'Không có sản phẩm trong giỏ hàng'} />
                        </div>
                    }
                </Col>
                <Col md={8} xs={24}>
                    <div className='order-right' >
                        <div className='order-bill'>
                            <Form form={form}>
                                <Form.Item
                                    label={<Typography.Text>Tên người nhận</Typography.Text>}
                                    labelCol={{ span: 24 }}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên người nhận!' }]}
                                    name='name'
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label={<Typography.Text>Số điện thoại</Typography.Text>}
                                    labelCol={{ span: 24 }}
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                    name='phone'
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label={<Typography.Text>Địa chỉ</Typography.Text>}
                                    labelCol={{ span: 24 }}
                                    rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                                    name='address'
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                                <Form.Item
                                    label={<Typography.Text>Hình thức thanh toán</Typography.Text>}
                                    labelCol={{ span: 24 }}
                                    name='payment'
                                >
                                    <Radio checked>Thanh toán khi nhận hàng</Radio>
                                </Form.Item>
                                <Divider />
                                <div className='order-sum'>
                                    <Typography.Text>Tổng tiền: </Typography.Text>
                                    <Typography.Text className='order-price'>{totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Typography.Text>
                                </div>
                                <Divider />
                                <Button
                                    htmlType='submit'
                                    className='btn-buy-order'
                                    onClick={onFinishPayment}
                                >
                                    Đặt hàng ({carts.length})
                                </Button>
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row >
        </>
    )
}

export default PaymentOrder