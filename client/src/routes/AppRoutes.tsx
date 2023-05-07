import Loading from '../components/common/Loading/Loading';
import NotFound from '../components/common/Found/NotFound';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/app/Home/HomePage';
import Order from '../pages/app/Order/OrderPage';
import Book from '../pages/app/Book/BookPage';
import LoginPage from '../pages/login/LoginPage';
import RegisterPage from '../pages/register/RegisterPage';
import LayoutAdmin from '../components/layout/LayoutAdmin';
import LayoutApp from '../components/layout/LayoutApp';
import DashboardPage from '../pages/admin/Dashboard/DashboardPage';
import UserPage from '../pages/admin/User/UserPage';
import BookPage from '../pages/admin/Book/BookPage';
import OrderPage from '../pages/admin/Order/OrderPage';
import HistoryPage from '../pages/app/History/HistoryPage';
import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useSelector } from 'react-redux';

const AppRoutes = () => {
    const isLoading = useSelector((state: any) => state?.account.isLoading)

    const router = createBrowserRouter([
        {
            path: "/",
            element: <LayoutApp />,
            errorElement: <NotFound />,
            children: [
                { index: true, element: <Home /> },
                {
                    path: 'book/:slug',
                    element: <Book />
                },
                {
                    path: 'order',
                    element:
                        <PrivateRoute>
                            <Order />
                        </PrivateRoute>
                },
                {
                    path: 'history',
                    element:
                        <PrivateRoute>
                            <HistoryPage />
                        </PrivateRoute>
                },
            ]
        },
        {
            path: "/admin",
            element:
                <PrivateRoute>
                    <LayoutAdmin />
                </PrivateRoute>,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />
                },
                {
                    path: 'user',
                    element: <UserPage />
                },
                {
                    path: 'book',
                    element: <BookPage />
                },
                {
                    path: 'order',
                    element: <OrderPage />
                },
            ]
        },
        {
            path: "/login",
            element: <LoginPage />
        },
        {
            path: "/register",
            element: <RegisterPage />
        },
    ]);

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/') && !pathname.startsWith('/admin')) {
            localStorage.removeItem('activeMenu');
        }
    }, []);

    return (
        <>
            {
                isLoading === false
                    || window.location.pathname === '/login'
                    || window.location.pathname === '/register'
                    || window.location.pathname === '/'
                    ? (
                        <RouterProvider router={router} />
                    ) : (
                        <Loading />
                    )
            }
        </>
    )
}

export default AppRoutes