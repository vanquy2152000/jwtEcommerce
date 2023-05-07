import moment from 'moment'
import { Descriptions, Drawer, Typography } from 'antd'
import { IOrders } from '../../../../types/order'

type Props = {
    openViewDetail: boolean
    dataOrderDetail?: IOrders
    handleCloseViewDetail?: () => void
}

const OrderDetail = ({ openViewDetail, dataOrderDetail, handleCloseViewDetail }: Props) => {
    return (
        <Drawer
            width='60vw'
            title={<Typography.Title level={4} style={{ margin: 0 }}>Xem chi tiết đơn hàng</Typography.Title>}
            open={openViewDetail}
            onClose={handleCloseViewDetail}
        >
            <Descriptions title={<Typography.Title level={5}>Thông tin đơn hàng</Typography.Title>} bordered column={2}>
                <Descriptions.Item label="Id">{dataOrderDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="Tên người dùng">{dataOrderDetail?.name}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{dataOrderDetail?.phone}</Descriptions.Item>
                <Descriptions.Item label="Giá tiền">{dataOrderDetail?.totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Descriptions.Item>
                <Descriptions.Item label="Hình thức thanh toán">{dataOrderDetail?.type}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                    {dataOrderDetail?.address}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                    {moment(dataOrderDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {moment(dataOrderDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    )
}

export default OrderDetail