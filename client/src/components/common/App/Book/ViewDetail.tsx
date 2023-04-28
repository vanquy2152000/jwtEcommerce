import { Button, Col, Input, Layout, Rate, Row, Typography } from 'antd'
import ImageGallery from 'react-image-gallery';
import './ViewDetail.scss'
import { useRef } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import '../../../../scss/custom-button.scss'

type Props = {}

const ViewDetail = (props: Props) => {
    const refGallery = useRef(null)

    const images = [
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
    ];

    return (
        <>
            <Layout className='view-container'>
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
                        />
                    </Col>

                    <Col md={14} sm={24}>
                        <Col md={0} sm={24} xs={24}>
                            <ImageGallery
                                ref={refGallery}
                                items={images}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                renderLeftNav={() => <></>}
                                renderRightNav={() => <></>}
                                showThumbnails={false}
                            />
                        </Col>
                        <Col span={24} style={{ display: 'flex', lineHeight: 2, flexDirection: 'column', gap: 10 }}>
                            <Typography.Text strong >Tác giả : <a href='#'>Tobi</a></Typography.Text>
                            <Typography.Title level={3} style={{ fontWeight: 400 }}>How The Body Works - Hiểu Hết Về Cơ Thể</Typography.Title>
                            <div className='rating'>
                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                <span>Đã bán : 2000</span>
                            </div>
                            <div className='price'>{(232333).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                            <div className='delivery'>
                                <Typography.Text  >Vận chuyển: </Typography.Text>
                                <Typography.Text  >Vận chuyển miễn phí</Typography.Text>
                            </div>
                            <div className='quantity'>
                                <Typography.Text  >Số lượng: </Typography.Text>
                                <span className='quantity-right'>
                                    <Button icon={<MinusOutlined />} />
                                    <Input defaultValue={1} style={{ width: '20%' }} />
                                    <Button icon={<PlusOutlined />} />
                                </span>
                            </div>
                            <div className='buy'>
                                <Button className="btn-add-product" icon={<BsCartPlus />}>
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button className="btn-buy-product">Mua ngay</Button>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Layout>
        </>
    )
}

export default ViewDetail