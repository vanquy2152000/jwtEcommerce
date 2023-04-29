import { Col, Image, Layout, Modal, Row, Typography } from 'antd'
import React from 'react'
import ImageGallery from 'react-image-gallery';
import { useState, useRef, useEffect } from 'react';
import { IBooks } from '../../../../types/book';

type Props = {
    refGallery: any
    images: any
    openModal: boolean
    dataBook?: IBooks
    currentIndex: number
    handleCloseModal: () => void
}

const ModalGallery = ({ refGallery, openModal, dataBook, currentIndex, images, handleCloseModal }: Props) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)

    useEffect(() => {
        if (openModal) {
            setActiveIndex(currentIndex);
        }
    }, [openModal, currentIndex])

    return (
        <Modal
            width={'60vw'}
            open={openModal}
            onCancel={handleCloseModal}
            style={{ top: 20, padding: 0 }}
            className='modal-gallery'
            okButtonProps={{ style: { display: 'none' } }}
            cancelButtonProps={{ style: { display: 'none' } }}
            footer={false}
        >
            <Row gutter={[20, 20]}>
                <Col span={16} >
                    <ImageGallery
                        ref={refGallery}
                        items={images}
                        showPlayButton={false} //hide play button
                        showFullscreenButton={false} //hide fullscreen button
                        showThumbnails={false}
                        startIndex={currentIndex}
                        onSlide={(index) => setActiveIndex(index)}
                        slideDuration={0}
                        additionalClass='image'

                    />
                </Col>
                <Col span={8}>
                    <Typography.Title level={5}>{dataBook?.mainText}</Typography.Title>
                    <Row gutter={[20, 20]}>
                        {
                            images?.map((item: any, index: number) => {
                                return (
                                    <Col>
                                        <Image
                                            wrapperClassName='img-normal'
                                            width={100}
                                            height={100}
                                            src={item.original}
                                            preview={false}
                                            onClick={() => refGallery.current.slideToIndex(index)}
                                        />
                                        <div className={activeIndex === index ? "active" : ""}></div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Col>
            </Row>
        </Modal >
    )
}

export default ModalGallery