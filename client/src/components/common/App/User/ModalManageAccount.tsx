import { Modal, Tabs, Typography } from 'antd'
import React from 'react'
import UserInfo from './UserInfo'
import ChangePassword from './ChangePassword'
import { JSX } from 'react/jsx-runtime'

type Props = {
    openModal: boolean
    handleCloseModal: () => void
}
interface ITabs {
    key: string,
    label: string,
    children: JSX.Element
}

const ModalManageAccount = ({ openModal, handleCloseModal }: Props) => {
    const items: ITabs[] = [
        {
            key: 'info',
            label: 'Cập nhật thông tin',
            children: <UserInfo />
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: <ChangePassword />
        }
    ]

    return (
        <>
            <Modal
                open={openModal}
                onCancel={handleCloseModal}
                title={<Typography.Title level={4} style={{ margin: 0 }}>Quản lí tài khoản</Typography.Title>}
                maskClosable={false}
                width={'60vw'}
                footer={null}

            >
                <Tabs
                    defaultActiveKey='info'
                    items={items}
                />
            </Modal>

        </>
    )
}

export default ModalManageAccount