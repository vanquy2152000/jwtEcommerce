import { DashboardOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { TbBooks } from 'react-icons/tb'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import './Sidebar.scss'
import { FaReact } from 'react-icons/fa';

type Props = {
    collapsed: boolean,
}

type SidebarItem = {
    key: string,
    icon: JSX.Element,
    label: string,
    children?: { key: string, label: string, icon: JSX.Element }[],
    danger?: boolean
}

const items: SidebarItem[] = [
    {
        key: '/admin',
        icon: <DashboardOutlined />,
        label: 'DashBoard',
    },
    {
        key: 'managePage',
        icon: <UserOutlined />,
        label: 'Manage Users',
        children: [
            {
                key: "/config-other/partner",
                icon: <UserOutlined />,
                label: 'Quản lý đối tác',
            },
        ]
    },
    {
        key: '/media-store/index',
        icon: <TbBooks />,
        label: 'Manage Books',
    },
    {
        key: 'order',
        icon: <RiMoneyDollarCircleLine />,
        label: 'Manage Orders',
    },
    // {
    //     key: "signout",
    //     icon: <PoweroffOutlined />,
    //     label: 'SignOut',
    //     danger: true
    // },
]
const Sidebar = ({ collapsed }: Props) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

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
                defaultSelectedKeys={[location.pathname]}
                selectedKeys={[location.pathname]}
                items={items}
            />
        </Sider >
    )
}

export default Sidebar