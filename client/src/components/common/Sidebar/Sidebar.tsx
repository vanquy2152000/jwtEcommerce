import Sider from 'antd/es/layout/Sider'
import { DashboardOutlined, PoweroffOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Menu, MenuProps, message, theme } from 'antd'
import { TbBooks } from 'react-icons/tb'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { FaReact } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import './Sidebar.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { doLogoutUser } from '../../../redux/account/accountSlice'
import { logoutUser } from '../../../service/authApi'

type Props = {
    collapsed: boolean,
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    danger?: boolean
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        danger
    } as MenuItem;
}


const Sidebar = ({ collapsed }: Props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [activeMenu, setActiveMenu] = useState<string>(localStorage.getItem("activeMenu") || "dashboard");

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const handleLogOut = async () => {
        const res = await logoutUser()
        if (res && res.data) {
            dispatch(doLogoutUser())
            message.success('Đăng xuất thành công')
            navigate('/')
        }
    }

    const items: MenuItem[] = [
        getItem(<Link to='/admin'>Dashboard</Link>, 'dashboard', <DashboardOutlined />),
        getItem(<span>Manage Users</span>, 'crud', <UserOutlined />, [
            getItem(<Link to='/admin/user'>User</Link>, 'crud', <FiUsers />),
            getItem(<Link to='/admin/user'>Test</Link>, 'file1', <TeamOutlined />),
        ]),
        getItem(<Link to='/admin/book'>Manage Books</Link>, 'book', <TbBooks />),
        getItem(<Link to='/admin/order'>Manage Orders</Link>, 'order', <RiMoneyDollarCircleLine />),
        getItem(<span style={{ color: 'red' }} onClick={handleLogOut}>Sign Out</span>, 'logout', <PoweroffOutlined style={{ color: 'red' }} />),
    ];

    const handleMenuClick = (e: any) => {
        setActiveMenu(e.key);
        localStorage.setItem("activeMenu", e.key);
    }

    return (
        <Sider
            width={220}
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="sidebar-container"
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                background: colorBgContainer
            }}
        >
            <div
                className="logo"
                style={{ cursor: 'default' }}
            >
                <FaReact className='rotate icon-react' />
            </div>
            <Menu
                mode="inline"
                selectedKeys={[activeMenu]}
                onClick={handleMenuClick}
                items={items}
            // key={activeMenu}
            />
        </Sider >
    )
}

export default Sidebar