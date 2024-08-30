import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/sidebar.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";

const Sidebar = ({ Toggle1 }) => {
    const [active, setActive] = useState(1);
    const navigate = useNavigate();
    const notify = () => toast.info('You have been logged out.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const handleLogout = () => {
        localStorage.removeItem('token');
        notify();
        navigate('/auth/login');
    };

    // Function to check if the screen size is small
    const isSmallScreen = () => window.innerWidth < 768;

    // Handle the close icon click
    const handleCloseClick = () => {
        if (isSmallScreen()) {
            Toggle1();
        }
    };

    // Handle the navigation link clicks
    const handleNavClick = (index) => {
        if (isSmallScreen()) {
            Toggle1();
        }
        setActive(index);
    };

    return (
        <div className='sidebar'>
            <div>
                <IoIosCloseCircleOutline className='close-icon' onClick={() => handleCloseClick()} />
                <a href='#' className='logo'>
                    <img src='https://t3.ftcdn.net/jpg/04/41/73/28/360_F_441732816_Eo3fHdX3oImKtXdkYkktCrR1mbwAT9I6.jpg' height={'120px'} width={'200px'} style={{ borderRadius: '10px' }}></img>
                </a>
                <hr className='mt-2' />
                <ul className='nav nav-pills flex-column mt-2'>
                    <li className='nav-item'>
                        <Link to='/dashboard/categories' className={`nav-link ${active === 1 ? 'active' : ''}`} onClick={() => {
                            setActive(1);
                            handleNavClick(1);
                        }}>
                            <i className="bi bi-list-task"></i>
                            <span>Category</span>
                        </Link>
                        <Link to='/dashboard/main_dashboard' className={`nav-link ${active === 2 ? 'active' : ''}`} onClick={() => {
                            setActive(2);
                            handleNavClick(2);
                        }}>
                            <i class="bi bi-speedometer2"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/dashboard/receipe' className={`nav-link ${active === 3 ? 'active' : ''}`} onClick={() => {
                            setActive(3);
                            handleNavClick(3);
                        }}>
                            <i className='bi bi-people'></i>
                            <span>Recipe</span>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/dashboard/tags' className={`nav-link ${active === 4 ? 'active' : ''}`} onClick={() => {
                            setActive(4);
                            handleNavClick(4);
                        }}>
                            <i className="bi bi-tags"></i>
                            <span>Tags</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <hr />
                <div className='user-info'>
                    <i className='bi bi-person-circle'></i>
                    <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
