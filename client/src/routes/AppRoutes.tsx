import Home from '../pages/home/HomePage';
import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './Layout';
import LoginPage from '../pages/login/LoginPage';
import Contact from '../pages/contact/ContactPage';
import Book from '../pages/book/BookPage';

type Props = {}

const AppRoutes = (props: Props) => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            errorElement: <>404 not found</>,
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
            path: "/login",
            element: <LoginPage />
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default AppRoutes