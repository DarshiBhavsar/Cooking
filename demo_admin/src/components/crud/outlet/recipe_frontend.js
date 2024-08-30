import React from 'react';
import { Outlet } from 'react-router-dom';

const RecipeFrontend = () => {
    return (
        <div>
            <Outlet /> {/* Child routes will be rendered here */}
        </div>
    );
};

export default RecipeFrontend;
