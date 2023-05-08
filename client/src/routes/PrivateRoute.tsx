
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import RoleBaseRoute from './RoleBaseRoute';

type Props = { children: any }

const PrivateRoute = (props: Props) => {
    const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated)

    const routePath = useLocation();

    const onTop = () => {
        window.scrollTo(0, 0);
    }
    useEffect(() => {
        onTop()
    }, [routePath.pathname]);

    return (
        <>
            {
                isAuthenticated === true
                    ?
                    (
                        <>
                            <RoleBaseRoute>
                                {props.children}
                            </RoleBaseRoute>
                        </>
                    )
                    :
                    (<Navigate to="/login" replace />)
            }
        </>
    )
}

export default PrivateRoute;