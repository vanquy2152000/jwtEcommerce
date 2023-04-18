
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import RoleBaseRoute from './RoleBaseRoute';

type Props = { children: any }

const PrivateRoute = (props: Props) => {
    const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated)

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