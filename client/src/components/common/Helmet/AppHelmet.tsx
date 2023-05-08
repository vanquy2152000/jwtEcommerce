import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

interface AppHelmetProps {
    title: string;
}

const AppHelmet: React.FC<AppHelmetProps> = ({ title }) => {
    const routerPath = useLocation()

    return (
        <div key={routerPath.key}>
            <Helmet>
                <title>{title}</title>
            </Helmet>
        </div>
    );
};

export default AppHelmet;
