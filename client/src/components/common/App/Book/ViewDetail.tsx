import ModalGallery from './ModalGallery';
import ImageGallery from 'react-image-gallery';
import { IBooks } from '../../../../types/book';
import { BsCartPlus } from 'react-icons/bs';
import { useState, useRef } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, InputNumber, Layout, Rate, Row, Typography, message } from 'antd'
import './ViewDetail.scss'
import '../../../../scss/custom-button.scss'
import BookLoader from './BookLoader';
import { useDispatch } from 'react-redux';
import { doAddBookAction } from '../../../../redux/order/orderSlice';
import { useNavigate } from 'react-router-dom';

type Props = {
    dataBook?: IBooks
}


const ViewDetail = ({ dataBook }: Props) => {
    const [openModalGallery, setOpenModalGallery] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [currentQuantity, setCurrentQuantity] = useState<number>(1)
    const navigate = useNavigate()
    const refGallery = useRef<any>(null)

    const dispatch = useDispatch()

    const images = dataBook?.items ?? []

    const handleCloseModalGallery = () => {
        setOpenModalGallery(false)
    }

    const handleSlide = (currentIndex: number) => {
        setCurrentIndex(currentIndex);
    }

    const handleOnClickImage = () => {
        setOpenModalGallery(true);
        console.log('check click image:', refGallery.current.getCurrentIndex() ?? 0)
    }

    const handleChangeButton = (type: string) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === 'PLUS') {
            if (currentQuantity === +dataBook!.quantity) return;
            setCurrentQuantity(currentQuantity + 1)
        }
    }
    const handleChangeInput = (value: any) => {
        // check xem gia tri nhap vao co phai la 1 so nguyen hay khong(isNaN)
        if (!isNaN(value)) {
            if (+value > 0 && +value <= +dataBook!.quantity) {
                setCurrentQuantity(+value)
            }
            if (+value > 0 && value > +dataBook!.quantity) {
                setCurrentQuantity(dataBook!.quantity)
                message.warning(`Vui lòng không nhập quá ${dataBook!.quantity} sản phẩm`)
            }
        }
    }

    const handleAddToCart = (currentQuantity: number, dataBook: IBooks) => {
        dispatch(doAddBookAction({ currentQuantity, detail: dataBook, _id: dataBook._id }))
    }

    const handleBuyNow = (currentQuantity: number, dataBook: IBooks) => {
        dispatch(doAddBookAction({ currentQuantity, detail: dataBook, _id: dataBook._id }))
        navigate('/order')
    }

    return (
        <>
            <Layout className='view-container'>
                {dataBook && dataBook._id ?
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGallery}
                                items={images}
                                showPlayButton={false} //hide play button
                                showFullscreenButton={false} //hide fullscreen button
                                renderLeftNav={() => <></>} //left arrow === <> </>
                                renderRightNav={() => <></>}//right arrow === <> </>
                                slideOnThumbnailOver={true}  //onHover => auto scroll images
                                onClick={handleOnClickImage}
                                onSlide={handleSlide}
                            />
                        </Col>

                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24} style={{ display: 'flex', lineHeight: 2, flexDirection: 'column', gap: 10 }}>
                                <Typography.Text strong >Tác giả : <a href='#'>{dataBook?.author}</a></Typography.Text>
                                <Typography.Title level={3} style={{ fontWeight: 400 }}>{dataBook?.mainText}</Typography.Title>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán : {dataBook?.sold}</span>
                                </div>
                                <div className='price'>{dataBook?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                                <div className='delivery'>
                                    <Typography.Text  >Vận chuyển: </Typography.Text>
                                    <Typography.Text  >Miễn phí vận chuyển</Typography.Text>
                                </div>
                                <div className='quantity'>
                                    <Typography.Text  >Số lượng: </Typography.Text>
                                    <span className='quantity-right'>
                                        <Button icon={<MinusOutlined />} onClick={() => handleChangeButton('MINUS')} />
                                        <InputNumber style={{ width: '20%' }} controls={false} value={currentQuantity} onChange={handleChangeInput} />
                                        <Button icon={<PlusOutlined />} onClick={() => handleChangeButton('PLUS')} />
                                        <span style={{ marginLeft: 10 }}>{dataBook!.quantity} sản phẩm có sẵn</span>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <Button
                                        className="btn-add-product"
                                        icon={<BsCartPlus />}
                                        onClick={() => handleAddToCart(currentQuantity, dataBook)}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                    <Button
                                        className="btn-buy-product"
                                        onClick={() => handleBuyNow(currentQuantity, dataBook)}
                                    >
                                        Mua ngay
                                    </Button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                    : <BookLoader />
                }
            </Layout>
            <ModalGallery
                refGallery={refGallery}
                openModal={openModalGallery}
                currentIndex={currentIndex}
                images={images}
                handleCloseModal={handleCloseModalGallery}
                dataBook={dataBook}
            />
        </>
    )
}

export default ViewDetail