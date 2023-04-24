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

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated)
    const user = useSelector((state: any) => state.account.user)
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const items: MenuProps['items'] = [
        {
            label: <Link to="#">Quản lí tài khoản</Link>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={() => handleLogOut()}>Log Out</span>,
            key: '1',
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
    useEffect(() => {
        if (window.location.pathname.startsWith('/admin')) {
            localStorage.removeItem("activeMenu");
        }
    }, []);

    return (
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
                                    <Dropdown menu={{ items }} trigger={['click']}>
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
    )
}

export default LayoutAdmin