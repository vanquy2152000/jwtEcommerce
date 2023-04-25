import { Badge, Descriptions, Divider, Drawer, Modal, Typography } from 'antd'
import { IBooks } from '../../../../types/book'
import moment from 'moment'
import Upload, { RcFile, UploadFile, UploadProps } from 'antd/es/upload'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

type Props = {
    openViewDetail: boolean
    dataBookDetail?: IBooks
    handleCloseViewDetail?: () => void
}

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const BookDetail = ({ openViewDetail, dataBookDetail, handleCloseViewDetail }: Props) => {
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    useEffect(() => {
        if (dataBookDetail) {
            let imgThumbnail = {}, imgSlider: any[] = []
            if (dataBookDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataBookDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBookDetail.thumbnail}`,
                }
            }
            if (dataBookDetail.thumbnail && dataBookDetail.slider.length > 0) {
                dataBookDetail.slider.map((item) => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataBookDetail])




    return (
        <Drawer
            width='50vw'
            title={<Typography.Title level={4} style={{ margin: 0 }}>Xem chi tiết người dùng</Typography.Title>}
            open={openViewDetail}
            onClose={handleCloseViewDetail}
        >
            <Descriptions title={<Typography.Title level={5}>Thông tin người dùng</Typography.Title>} bordered column={2}>
                <Descriptions.Item label="Id">{dataBookDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="Tên sách">{dataBookDetail?.mainText}</Descriptions.Item>
                <Descriptions.Item label="Tác giả">{dataBookDetail?.author}</Descriptions.Item>
                <Descriptions.Item label="Giá tiền">{dataBookDetail?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Descriptions.Item>
                <Descriptions.Item label="Số lượng">{dataBookDetail?.quantity}</Descriptions.Item>
                <Descriptions.Item label="Đã bán">{dataBookDetail?.sold}</Descriptions.Item>
                <Descriptions.Item label="Thể loại" span={2}>
                    <Badge color='#ea4c89' text={dataBookDetail?.category} />
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                    {moment(dataBookDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {moment(dataBookDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                </Descriptions.Item>
            </Descriptions>
            <Divider orientation='left'>Ảnh Books</Divider>
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={{ showRemoveIcon: false }}
            />
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Drawer>
    )
}

export default BookDetail