import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Footer, Header } from 'antd/es/layout/layout'
import { Badge, Input, Dropdown, Space, MenuProps, message, Layout, Avatar } from 'antd'
import { DownOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { FaReact } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../service/authApi'
import { doLogoutUser } from '../../redux/account/accountSlice'
import './LayoutApp.scss'

const LayoutApp = () => {
    const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated)
    const user = useSelector((state: any) => state.account.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

    let items: MenuProps['items'] = [
        {
            label: <Link to="#">Quản lí tài khoản</Link>,
            key: '1',
        },
        {
            label: <Link to='#'>Lịch sử mua hàng</Link>,
            key: '2',
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={() => handleLogOut()}>Log Out</span>,
            key: '3',
        },
    ];

    if (isAuthenticated === true && user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to="/admin">Trang quản trị</Link>,
            key: '0',
        })
    }

    const handleLogOut = async () => {
        const res = await logoutUser()
        if (res && res.data) {
            dispatch(doLogoutUser())
            message.success('Đăng xuất thành công')
            navigate('/')
        }
    }

    return (
        <Layout className='layout-app'>
            <Header className="header-layout">
                <span className='header-logo'>
                    <FaReact className='rotate icon-react' />
                    <span>Ecommerce</span>
                </span>
                <Input.Search
                    placeholder="Tìm kiếm sản phẩm"
                    style={{ width: '50%', height: 36 }}
                // size="large"
                // onSearch={(value: any) => console.log(value)}
                />
                <span style={{ cursor: 'pointer' }}>
                    <Badge count={5} size="small" overflowCount={10} >
                        <ShoppingCartOutlined style={{ fontSize: '24px', color: '#ea4c89' }} />
                    </Badge>
                </span>
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
            </Header>
            <Outlet />
            <Footer style={{ backgroundColor: '#fff', margin: '0 auto' }}>dsds</Footer>
        </Layout >
    )
}

export default LayoutApp