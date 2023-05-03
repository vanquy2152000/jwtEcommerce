import { Button, Col, Divider, Empty, Form, Image, InputNumber, Layout, Row, Typography, message } from 'antd'
import './ViewOrder.scss'
import '../../../../scss/custom-button.scss'
import { BiTrash } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { doDeleteCartAction, doUpdateCartAction } from '../../../../redux/order/orderSlice'
import { useEffect, useState } from 'react';

type Props = {
    setCurrentStep: any
}

const ViewOrder = ({ setCurrentStep }: Props) => {
    const dispatch = useDispatch()
    const carts = useSelector((state: any) => state.order.carts)
    const [totalPrice, setTotalPrice] = useState<number>(0)

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

    const handleCartsBuy = () => {
        if (carts.length === 0) {
            message.warning('Vui lòng thêm sản phẩm vào giỏ hàng!')
        }
        if (carts.length !== 0) {
            setCurrentStep(1)
        }
    }

    return (
        <>
            <Row gutter={[20, 20]} className='order-content'>
                <Col md={18} xs={24} className='order-left'>
                    {
                        carts.map((item: any) => {
                            const currentBookPrice = item?.detail?.price ?? 0
                            const sum = item.quantity * currentBookPrice

                            return (
                                <>
                                    <Col md={24} xs={24} className='order-content'>
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
                                            />
                                        </Col>
                                        <Col offset={3} span={3} style={{ paddingLeft: '30' }}>
                                            <span>Tổng : </span>
                                            {sum.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                        </Col>
                                        <Col offset={2} span={3} className='order-icon'>
                                            <BiTrash onClick={() => dispatch(doDeleteCartAction({ _id: item._id, quantity: item.quantity, detail: item }))} />
                                        </Col>
                                    </Col>
                                    <br />

                                </>
                            )
                        })}
                    {
                        carts.length === 0 &&
                        <div style={{ background: '#fff', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Empty
                                description={'Không có sản phẩm trong giỏ hàng'}
                            />
                        </div>
                    }
                </Col>
                <Col md={6} xs={24}>
                    <div className='order-right' >
                        <div className='order-bill'>
                            <div className='order-provisional'>
                                <Typography.Text>Tạm tính:  </Typography.Text>
                                <Typography.Text className='order-price'>{totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Typography.Text>
                            </div>
                            <Divider />
                            <div className='order-sum'>
                                <Typography.Text>Tổng tiền: </Typography.Text>
                                <Typography.Text className='order-price'>{totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Typography.Text>
                            </div>
                            <Divider />
                            <Button
                                htmlType='button'
                                className='btn-buy-order'
                                onClick={handleCartsBuy}
                            >
                                Mua hàng ({carts.length})
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default ViewOrder