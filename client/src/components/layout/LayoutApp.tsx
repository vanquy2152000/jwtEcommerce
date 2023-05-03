import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Footer, Header } from 'antd/es/layout/layout'
import { Badge, Input, Dropdown, Space, MenuProps, message, Layout, Avatar, Popover, Button, Typography, Image, Row } from 'antd'
import { DownOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { FaReact } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../service/authApi'
import { doLogoutUser } from '../../redux/account/accountSlice'
import './LayoutApp.scss'
import '../../scss/global-popover.scss'
import { useState } from 'react';
import ModalManageAccount from '../common/App/History/ModalManageAccount';

const LayoutApp = () => {
    const [showAll, setShowAll] = useState<boolean>(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.account.user)
    const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated)
    const carts = useSelector((state: any) => state.order.carts)
    const [showModalManageAccount, setShowModalManageAccount] = useState<boolean>(false)

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

    const visibleCarts = showAll ? carts : carts.slice(0, 6);

    const handleViewMore = () => {
        setShowAll(true);
    };

    const text = <Typography.Text strong>Sản phẩm mới thêm</Typography.Text>;
    const contentPopover = (
        <>
            {visibleCarts.map((item: any) => {
                return (
                    <Row style={{ gap: 20 }} key={item._id}>
                        <>
                            <Image
                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`}
                                preview={false}
                                width={50}
                                height={50}
                            />
                            <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }} className="my-paragraph">
                                {item?.detail?.mainText}
                            </Typography.Paragraph>
                            <span className='price'>x{item.quantity}</span>
                            <div className='price'>
                                {item?.detail?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                            </div>
                        </>
                    </Row>
                )
            })}

            {carts.length > 6 && !showAll && (
                <Button htmlType='button' className='btn-view-more' style={{ margin: 'auto' }} onClick={handleViewMore}>
                    Xem thêm....
                </Button>
            )}

            <Button
                htmlType='button'
                className='btn-view-product'
                style={{ marginLeft: 'auto' }}
                onClick={() => navigate('/order')}
            >
                Xem giỏ hàng
            </Button>
        </>
    );

    let items: MenuProps['items'] = [
        {
            label: <div onClick={() => setShowModalManageAccount(true)}>Quản lí tài khoản</div>,
            key: '1',
        },
        {
            label: <Link to='/history'>Lịch sử mua hàng</Link>,
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
    const handleCloseModalManageAccount = () => {
        setShowModalManageAccount(false)
    }

    return (
        <>
            <Layout className='layout-app'>
                <Header className="header-layout">
                    <span className='header-logo' onClick={() => navigate('/')}>
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
                        <Popover
                            placement="bottomRight"
                            title={text}
                            content={contentPopover}
                            arrow={true}
                            rootClassName='popover-carts'
                        >
                            <Badge count={carts.length ?? 0} size="small" overflowCount={10} showZero >
                                <ShoppingCartOutlined style={{ fontSize: '24px', color: '#ea4c89' }} />
                            </Badge>
                        </Popover>
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
            <ModalManageAccount
                openModal={showModalManageAccount}
                handleCloseModal={handleCloseModalManageAccount}
            />
        </>
    )
}

export default LayoutApp