import { useSelector } from 'react-redux'
import NotPermitted from '../components/common/Found/NotPermitted'

type Props = { children: any }

const RoleBaseRoute = (props: Props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin')
    const user = useSelector((state: any) => state.account.user)
    const userRole = user.role

    return (
        <>
            {
                isAdminRoute && userRole === 'ADMIN' || !isAdminRoute && (userRole === 'USER' || userRole === 'ADMIN')
                    ? (
                        <>
                            {props.children}
                        </>
                    )
                    : (
                        <NotPermitted />
                    )
            }
        </>
    )
}

export default RoleBaseRoute