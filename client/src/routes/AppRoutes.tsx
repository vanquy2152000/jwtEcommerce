import Home from '../pages/home/HomePage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/login/LoginPage';
import Contact from '../pages/contact/ContactPage';
import Book from '../pages/book/BookPage';
import RegisterPage from '../pages/register/RegisterPage';
import NotFound from '../components/common/Found/NotFound';
import LayoutAdmin from '../components/layout/LayoutAdmin';
import PrivateRoute from './PrivateRoute';
import { useSelector } from 'react-redux';
import Loading from '../components/common/Loading/Loading';
import LayoutApp from '../components/layout/LayoutApp';
import DashboardPage from '../pages/admin/Dashboard/DashboardPage';
import UserPage from '../pages/admin/User/UserPage';
import BookPage from '../pages/admin/Book/BookPage';
import OrderPage from '../pages/admin/Order/OrderPage';
import { useEffect } from 'react';
type Props = {}

const AppRoutes = (props: Props) => {
    const isLoading = useSelector((state: any) => state?.account.isLoading)

    const router = createBrowserRouter([
        {
            path: "/",
            element: <LayoutApp />,
            errorElement: <NotFound />,
            children: [
                { index: true, element: <Home /> },
                {
                    path: 'contact',
                    element: <Contact />
                },
                {
                    path: 'book',
                    element: <Book />
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
        if (!pathname.startsWith('/admin')) {
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