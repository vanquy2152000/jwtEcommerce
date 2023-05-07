import ModalManageAccount from '../common/App/User/ModalManageAccount';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Footer, Header } from 'antd/es/layout/layout'
import { Badge, Input, Dropdown, Space, MenuProps, message, Layout, Avatar, Popover, Button, Typography, Image, Row, Col } from 'antd'
import { DownOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { FaReact } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../service/authApi'
import { doLogoutUser } from '../../redux/account/accountSlice'
import {  useState } from 'react';
import './LayoutApp.scss'
import '../../scss/global-popover.scss'
import paypal from '../../assets/PaymentMethods/paypal.png'
import bitcoin from '../../assets/PaymentMethods/bitcoin.png'
import shopify from '../../assets/PaymentMethods/shopify.png'
import visa from '../../assets/PaymentMethods/visa.png'
import { debounce } from 'lodash';

const LayoutApp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.account.user)
    const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated)
    const carts = useSelector((state: any) => state.order.carts)
    const [showAll, setShowAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [showModalManageAccount, setShowModalManageAccount] = useState<boolean>(false)

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

    const visibleCarts = showAll ? carts : carts.slice(0, 6);

    const handleViewMore = () => {
        setShowAll(true);
    };
    console.log(searchTerm)

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
    const handleOnSearch = (values: string) => {
        console.log('values :', values)
        setSearchTerm(values)
    }

    const handleOnChangeSearch = debounce((e: any) => {
        setSearchTerm(e.target.value);
    }, 500)

    return (
        <>
            <Layout className='layout-app'>
                <Header className="header-layout">
                    <span className='header-logo' onClick={() => navigate('/')}>
                        <FaReact className='rotate icon-react' />
                        <span>Ecommerce</span>
                    </span>
                    <Input.Search
                        allowClear
                        placeholder="Tìm kiếm sản phẩm"
                        style={{ width: '50%', height: 36 }}
                        onSearch={handleOnSearch}
                        onChange={(e: any) => handleOnChangeSearch(e)}
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
                <Outlet key={searchTerm} context={[searchTerm, setSearchTerm]} />
                <Footer style={{ padding: 10 }} >
                    <Row style={{ backgroundColor: '#fff', padding: '20px' }}>
                        <Col md={6} xs={24} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <Typography.Title level={5}>Hỗ trợ khách hàng</Typography.Title>
                            <Typography.Text>
                                Hotline: 1900-6035
                                (1000 đ/phút, 8-21h kể cả T7, CN)
                            </Typography.Text>
                            <Typography.Text>
                                Các câu hỏi thường gặp
                            </Typography.Text>
                            <Typography.Text>
                                Gửi yêu cầu hỗ trợ
                            </Typography.Text>
                            <Typography.Text>
                                Hướng dẫn đặt hàng
                            </Typography.Text>
                            <Typography.Text>
                                Phương thức vận chuyển
                            </Typography.Text>
                        </Col>
                        <Col md={6} xs={24} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <Typography.Title level={5}>Về Ecommerce</Typography.Title>
                            <Typography.Text>
                                Giới thiệu Ecommerce
                            </Typography.Text>
                            <Typography.Text>
                                Chính sách bảo mật thanh toán
                            </Typography.Text>
                            <Typography.Text>
                                Chính sách bảo mật thông tin cá nhân
                            </Typography.Text>
                            <Typography.Text>
                                Chính sách giải quyết khiếu nại
                            </Typography.Text>
                            <Typography.Text>
                                Điều khoản sử dụng
                            </Typography.Text>
                        </Col>
                        <Col md={6} xs={24} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <Typography.Title level={5}>Hợp tác liên kết</Typography.Title>
                            <Typography.Text>
                                Quy chế hoạt động Sàn GDTMĐT
                            </Typography.Text>
                            <Typography.Text>
                                Bán hàng cùng Ecommerce
                            </Typography.Text>
                        </Col>
                        <Col md={6} xs={24} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <Typography.Title level={5}>Phương thức thanh toán</Typography.Title>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                                <Image width={50} height={50} src={visa} preview={false} />
                                <Image width={50} height={50} src={paypal} preview={false} />
                                <Image width={50} height={50} src={bitcoin} preview={false} />
                                <Image width={50} height={50} src={shopify} preview={false} />
                            </div>
                        </Col>
                    </Row>
                </Footer>
            </Layout >
            <ModalManageAccount
                openModal={showModalManageAccount}
                handleCloseModal={handleCloseModalManageAccount}
            />
        </>
    )
}

export default LayoutApp