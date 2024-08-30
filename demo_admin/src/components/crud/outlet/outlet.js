import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardOutlet = () => {
    return (
        <div>
            <Outlet /> {/* Child routes will be rendered here */}
        </div>
    );
};

export default DashboardOutlet;
