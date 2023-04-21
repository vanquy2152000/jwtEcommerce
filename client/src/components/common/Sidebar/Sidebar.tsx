import Sider from 'antd/es/layout/Sider'
import { DashboardOutlined, PoweroffOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Menu, theme } from 'antd'
import { TbBooks } from 'react-icons/tb'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { FaReact } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import './Sidebar.scss'
import { Link } from 'react-router-dom'
import { useState } from 'react'

type Props = {
    collapsed: boolean,
}

type SidebarItem = {
    key?: string,
    icon?: JSX.Element,
    label: JSX.Element,
    children?: { key?: string, label: JSX.Element, icon?: JSX.Element }[],
    danger?: boolean
}

const items: SidebarItem[] = [
    {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: <Link to='/admin'>Dashboard</Link>,
    },
    {
        icon: <UserOutlined />,
        label: <span>Manage Users</span>,
        children: [
            {
                key: "crud",
                icon: <FiUsers />,
                label: <Link to='/admin/user'>CRUD</Link>,
            },
            {
                label: <Link to='/admin/user'>File1</Link>,
                key: 'file1',
                icon: <TeamOutlined />,
            }
        ]
    },
    {
        icon: <TbBooks />,
        label: <Link to='/admin/book'>Manage Books</Link>,
    },
    {
        icon: <RiMoneyDollarCircleLine />,
        label: <Link to='/admin/order'>Manage Orders</Link>,
    },
    {
        icon: <PoweroffOutlined />,
        label: <span>Sign Out</span>,
        danger: true
    },
]
const Sidebar = ({ collapsed }: Props) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [activeMenu, setActiveMenu] = useState<string>('dashboard');

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
                defaultSelectedKeys={[activeMenu]}
                onClick={(e) => setActiveMenu(e.key)}
                items={items}
            />
        </Sider >
    )
}

export default Sidebar