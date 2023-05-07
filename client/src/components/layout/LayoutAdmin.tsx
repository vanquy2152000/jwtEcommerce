import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Dropdown, Layout, MenuProps, Space, message, theme } from 'antd'
import { Content, Header } from 'antd/es/layout/layout';
import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import './LayoutAdmin.scss';
import Sidebar from '../common/Sidebar/Sidebar';
import { logoutUser } from '../../service/authApi';
import { doLogoutUser } from '../../redux/account/accountSlice';
import ModalManageAccount from '../common/App/User/ModalManageAccount';

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [showModalManageAccount, setShowModalManageAccount] = useState<boolean>(false)
    const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated)
    const user = useSelector((state: any) => state.account.user)
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleCloseModalManageAccount = () => {
        setShowModalManageAccount(false)
    }

    const items: MenuProps['items'] = [
        {
            label: <Link to="/" onClick={() => localStorage.removeItem('activeMenu')}>Trang chủ sản phẩm</Link>,
            key: '0',
        },
        {
            label: <div onClick={() => setShowModalManageAccount(true)}>Quản lí tài khoản</div>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={() => handleLogOut()}>Log Out</span>,
            key: '2',
        },
    ];

    const handleLogOut = async () => {
        const res = await logoutUser()
        if (res && res.data) {
            dispatch(doLogoutUser())
            message.success('Đăng xuất thành công')
            navigate('/')
        }
    }

    return (
        <>
            <Layout style={{ minHeight: '100vh' }} hasSider>
                <Sidebar collapsed={collapsed} />
                <Layout
                    style={
                        collapsed ?
                            {
                                marginLeft: 80,
                                width: '50%',
                                height: "100vh",
                                transition: "margin-left 0.5s"
                            }
                            :
                            {
                                marginLeft: 220,
                                height: "100vh",
                                transition: "margin-left 0.5s"
                            }
                    }
                >
                    <Header className="admin-header"
                        style={
                            collapsed ?
                                {
                                    width: '95%',
                                    transition: "margin-right 0.1s"
                                }
                                :
                                {
                                    width: '86%',
                                    transition: "margin-right 0.1s"
                                }
                        }
                    >
                        <div className="leftside">
                            <div>
                                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: 'trigger',
                                    onClick: () => setCollapsed(!collapsed),
                                })}
                            </div>
                        </div>

                        <div className="rightside">
                            {
                                user && isAuthenticated !== true
                                    ? (
                                        <span className="header-text" onClick={() => navigate('/login')}>
                                            Tài khoản
                                        </span>
                                    ) : (
                                        <Dropdown menu={{ items }} trigger={['click']} >
                                            <span className="header-text" onClick={(e) => e.preventDefault()}>
                                                <Space>
                                                    <Avatar size={46} src={urlAvatar} />
                                                    <span>Welcome {user.fullName}</span>
                                                    <DownOutlined />
                                                </Space>
                                            </span>
                                        </Dropdown>
                                    )
                            }
                        </div>
                    </Header>
                    <Content
                        style={{
                            marginTop: 64,
                            padding: '20px',
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout >
            <ModalManageAccount
                openModal={showModalManageAccount}
                handleCloseModal={handleCloseModalManageAccount}
            />
        </>
    )
}

export default LayoutAdmin