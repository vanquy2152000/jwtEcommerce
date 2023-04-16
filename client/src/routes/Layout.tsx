import React from 'react'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/Footer'

type Props = {}

const Layout = (props: Props) => {
    return (
        <div className='layout-app'>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout