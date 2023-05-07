import { Col, Form, Input, InputNumber, Modal, Row, Select, Typography, Upload, UploadFile, message, notification } from 'antd'
import { getAllCategoriesBooks, postAddBook, postUploadImageBook, putUpdateBook } from '../../../../service/bookApi'
import { IAddUpdateBook, IBooks } from '../../../../types/book'
import { useForm } from 'antd/es/form/Form'
import '../../../../scss/custom-button.scss'
import { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import { v4 as uuidv4 } from 'uuid';

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
    const [loadingThumnbnail, setLoadingThumnbnail] = useState<boolean>(false)
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false)

    const [imageUrl, setImageUrl] = useState<string>("");

    const [listCategories, setListCategories] = useState<[]>([])

    const [dataThumbnail, setDataThumbnail] = useState<Array<{ name: any; uid: any; status: any; url: any }>>([])
    const [dataSlider, setDataSlider] = useState<Array<{ name: any; uid: any; }>>([])

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');

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

    // select option
    useEffect(() => {
        const fetchListCategories = async () => {
            const res = await getAllCategoriesBooks()
            if (res && res.data) {
                const mapCategory = res.data.map((item: any) => {
                    return { label: item, value: item }
                })
                setListCategories(mapCategory)
            }
        }
        fetchListCategories()
    }, [])

    // Upload
    const getBase64 = (file: RcFile, callback?: any): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);

            reader.addEventListener('load', () => callback(reader.result));
        });

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    // change image
    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }: any) => {
        const res = await postUploadImageBook(file)

        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`,
            }])
            setLoadingThumnbnail(false)
            onSuccess('Ok')
        } else {
            onError('Đã có lỗi xảy ra khi upload file')
        }
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }: any) => {
        const res = await postUploadImageBook(file)
        if (res && res.data) {
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`,
            }])
            setLoadingSlider(false)
            onSuccess('Ok')
        } else {
            onError('Đã có lỗi xảy ra khi upload file')
        }
    };


    // remove image file
    const handleRemoveImageFile = (file: any, type: any) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(item => item.uid !== file.uid)
            setDataSlider(newSlider)
        }
    }

    // change loading
    const handleChange = (info: any, type: any) => {
        if (info.file.status === 'uploading') {
            type === 'slider' ? setLoadingSlider(true) : setLoadingThumnbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url: any) => {
                type ? setLoadingSlider(false) : setLoadingThumnbnail(false);
                setImageUrl(url);
            });
        }

    };

    // Modal
    const handleSaveModal = async () => {
        await form.validateFields()
        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload ảnh thumbnail'
            })
            return;
        }
        if (dataSlider.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload ảnh slider'
            })
            return;
        }
        const actionPayload: IAddUpdateBook = {
            thumbnail: dataThumbnail[0].name,
            slider: dataSlider.map(item => item.name),
            mainText: form.getFieldValue('mainText'),
            author: form.getFieldValue('author'),
            price: form.getFieldValue('price'),
            sold: form.getFieldValue('sold'),
            quantity: form.getFieldValue('quantity'),
            category: form.getFieldValue('category')
        }

        enterLoading(1)
        if (actionModal === 'CREATE') {
            const res = await postAddBook(actionPayload)

            if (res && res.data) {
                message.success('Tạo thành công!')
                form.resetFields()
                handleSaveModalBook()
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra'
                })
            }
        }
        if (actionModal === 'UPDATE') {
            const res = await putUpdateBook(actionPayload, dataBookDetail!._id)

            if (res && res.data) {
                message.success('Cập nhật thành công')
                handleSaveModalBook()
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra'
                })
            }
        }
    }
    const handleCloseModal = () => {
        form.resetFields()
        handleCloseModalBook()
    }

    useEffect(() => {
        if (actionModal === 'CREATE') {
            form.resetFields()
            setDataThumbnail([])
            setDataSlider([])
        }
        if (actionModal === 'UPDATE') {
            if (dataBookDetail) {
                const arrThumbnail = [
                    {
                        uid: uuidv4(),
                        name: dataBookDetail.thumbnail,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBookDetail.thumbnail}`,
                    }
                ]

                const arrSlider = dataBookDetail.slider.map((item: string) => {
                    return {
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    }
                })

                form.setFieldValue('_id', dataBookDetail._id)
                form.setFieldValue('mainText', dataBookDetail.mainText)
                form.setFieldValue('author', dataBookDetail.author)
                form.setFieldValue('price', dataBookDetail.price)
                form.setFieldValue('sold', dataBookDetail.sold)
                form.setFieldValue('quantity', dataBookDetail.quantity)
                form.setFieldValue('category', dataBookDetail.category)
                form.setFieldValue('slider', dataBookDetail.slider)
                setDataThumbnail(arrThumbnail)
                setDataSlider(arrSlider)
            }
        }
    }, [actionModal, openModal, dataBookDetail, form])

    return (
        <Modal
            title={
                <Typography.Title level={4} style={{ margin: 0 }}>
                    {actionModal === 'CREATE' ? 'Thêm mới book' : 'Cập nhật book'}
                </Typography.Title>
            }
            width={800}
            open={openModal}
            onOk={handleSaveModal}
            onCancel={handleCloseModal}
            okText={actionModal === 'CREATE' ? 'Tạo mới' : 'Cập nhật'}
            cancelText='Hủy'
            okButtonProps={{ className: 'btn-ok-modal' }}
            cancelButtonProps={{ className: 'btn-cancel-modal' }}
            confirmLoading={loadings[1]}
            forceRender
            style={{ top: 20 }}
        >
            <Form form={form}>
                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item
                            label={<Typography.Text strong >Tên sách</Typography.Text>}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                            name='mainText'
                        >
                            <Input />
                        </Form.Item>
                        <Col>

                        </Col>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Typography.Text strong >Tên tác giả</Typography.Text>}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
                            name='author'
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={<Typography.Text strong>Giá tiền</Typography.Text>}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
                            name='price'
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter='VND'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={<Typography.Text strong>Thể loại</Typography.Text>}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                            name='category'
                        >
                            <Select
                                showSearch
                                allowClear
                                options={listCategories}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={<Typography.Text strong>Số lượng</Typography.Text>}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                            name='quantity'
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label={<Typography.Text strong>Đã bán</Typography.Text>}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Vui lòng số lượng đã bán!' }]}
                            name='sold'
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Typography.Text strong>Ảnh Thumbnail</Typography.Text>}
                            labelCol={{ span: 24 }}
                            name='thumbnail'
                        >
                            <Upload
                                name="thumbnail"
                                multiple={false}
                                maxCount={1}
                                listType="picture-card"
                                customRequest={handleUploadFileThumbnail}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                onChange={(info) => handleChange(info, 'thumbnail')}
                                onRemove={(file) => handleRemoveImageFile(file, 'thumbnail')}
                                fileList={dataThumbnail ?? []}
                            >
                                <div>
                                    {loadingThumnbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Typography.Text strong>Ảnh Slider</Typography.Text>}
                            labelCol={{ span: 24 }}
                            name='slider'
                        >
                            <Upload
                                name="slider"
                                multiple
                                listType="picture-card"
                                customRequest={handleUploadFileSlider}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                onChange={(info) => handleChange(info, 'slider')}
                                onRemove={(file) => handleRemoveImageFile(file, 'slider')}
                                fileList={dataSlider ?? []}
                            >
                                <div>
                                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalBook