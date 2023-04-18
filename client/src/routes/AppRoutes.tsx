import Home from '../pages/home/HomePage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/login/LoginPage';
import Contact from '../pages/contact/ContactPage';
import Book from '../pages/book/BookPage';
import RegisterPage from '../pages/register/RegisterPage';
import NotFound from '../components/common/Found/NotFound';
import LayoutAdmin from '../components/layout/LayoutAdmin';
import PrivateRoute from './PrivateRoute';
import AdminPage from '../pages/admin/AdminPage';
import { useSelector } from 'react-redux';
import Loading from '../components/common/Loading/Loading';
import LayoutApp from '../components/layout/LayoutApp';
type Props = {}

const AppRoutes = (props: Props) => {

    const isLoading = useSelector((state: any) => state?.account.isLoading)
    console.log(isLoading)

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
            element: <LayoutAdmin />,
            errorElement: <NotFound />,
            children: [
                {
                    index: true, element:
                        <PrivateRoute>
                            <AdminPage />
                        </PrivateRoute>
                },
                {
                    path: 'user',
                    element: <Contact />
                },
                {
                    path: 'book',
                    element: <Book />
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