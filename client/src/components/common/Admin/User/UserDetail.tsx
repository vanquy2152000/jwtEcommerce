import { Badge, Descriptions, Drawer, Typography } from 'antd'
import { IUsers } from '../../../../types/user'
import moment from 'moment'

type Props = {
    openViewDetail: boolean
    dataUserDetail?: IUsers
    handleCloseViewDetail?: () => void
}

const UserDetail = ({ openViewDetail, dataUserDetail, handleCloseViewDetail }: Props) => {
    return (
        <Drawer
            width='50vw'
            title={<Typography.Title level={4} style={{ margin: 0 }}>Xem chi tiết người dùng</Typography.Title>}
            open={openViewDetail}
            onClose={handleCloseViewDetail}
        >
            <Descriptions title={<Typography.Title level={5}>Thông tin người dùng</Typography.Title>} bordered column={2}>
                <Descriptions.Item label="Id">{dataUserDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="Tên hiển thị">{dataUserDetail?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{dataUserDetail?.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{dataUserDetail?.phone}</Descriptions.Item>
                <Descriptions.Item label="Role" span={2}>
                    <Badge color='#ea4c89' text={dataUserDetail?.role} />
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                    {moment(dataUserDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {moment(dataUserDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    )
}

export default UserDetail