
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import GuestRoute from './guestRoute';

const RouteBase = () => {
    const [toggle, setToggle] = useState(false);
    const Toggle = () => {
        setToggle(!toggle);
    };

    return (
        <>

        </>
    )

}
export default RouteBase