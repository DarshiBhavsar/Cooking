import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import '../Category_page/category_page.css';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import BASE_URL from '../../../config/config';
const CategoryPage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const token = window.localStorage.getItem('token');
        axios.get(`${BASE_URL}/getCategories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => setCategory(result.data))
            .catch(err => console.log(err));
    }, []);
    const [Category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(''); // S
    // const handleCategoryChange = (e) => {
    //     setSelectedCategory(e.target.value); // Update the selected category
    // };
    const handleCategoryClick = (category) => {
        navigate(`/web/recipe_page`, {
            state: { name: category.name, } // Pass the category ID along with the name
        });
    };
    return (
        <div>
            <div className='custom-navbar-wrapper1'>
                <Navbar expand="lg" className="custom-navbar1" sticky="top">
                    <div className="navbar-flex-container">
                        <Navbar.Brand href="#home" className="custom-navbar-brand">
                            <img className='logo1' src='https://foodhub.modeltheme.com/wp-content/themes/foodhub/images/logo.png' alt='logo' />
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-navbar-toggler" />

                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto list">
                                <Nav.Link as={Link} to='/web/home_page' className="custom-nav-link1">Home</Nav.Link>
                                <Nav.Link as={Link} to='/web/category_page' className="custom-nav-link1">Categories</Nav.Link>
                                <Nav.Link as={Link} to='/web/recipe_page' className="custom-nav-link1">Recipes</Nav.Link>
                                <Nav.Link href="#link2" className="custom-nav-link1">ContactUs</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </div>

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto list1">
                            <Nav.Link href="#home" className="custom-nav-link2"><i className="bi bi-search"></i></Nav.Link>
                            <Nav.Link href="#home" className="custom-nav-link2"><i className="bi bi-person"></i></Nav.Link>
                            <Nav.Link href="#link1" className="custom-nav-link2"><i className="bi bi-bag"></i></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>

            <p className='text-center h1 mt-5'>All Categories</p>
            <div>
                <div className='category-section1'>
                    {Category.map((items) => {
                        return (
                            <div
                                className='category-card'
                                onClick={() => handleCategoryClick(items)}
                                key={items.name}
                            >
                                <img
                                    src={items.image}
                                    alt={items.name}
                                    className='category-image1'
                                />
                                <h4 className='text-center mt-4 category-name'>{items.name}</h4>
                                <p className='category-description'>{items.description}</p>
                                {/* <p className='category-status'>{items.status}</p> */}
                            </div>
                        );
                    })}
                </div>

            </div>
            <footer className="footer">
                <div className="bg-[#1d1c1c] py-4 py-md-5 py-xl-8 border-top border-light text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <h5>About Foodhub</h5>
                                <p>Foodhub is your go-to platform for discovering new recipes, cooking tips, and culinary inspiration. Whether you're a seasoned chef or just starting, we've got something delicious for you.</p>
                            </div>
                            <div className="col-md-4">
                                <h5>Quick Links</h5>
                                <ul className="list-unstyled">
                                    <li><Link to="/web/home_page" className="text-white">Home</Link></li>
                                    <li><Link to="/web/category_page" className="text-white">Categories</Link></li>
                                    <li><Link to="/web/recipe_page" className="text-white">Recipes</Link></li>
                                    <li><a href="#contact" className="text-white">Contact Us</a></li>
                                </ul>
                            </div>
                            <div className="col-md-4">
                                <h5>Subscribe to Our Newsletter</h5>
                                <p>Get the latest recipes and culinary tips straight to your inbox. Sign up today!</p>
                                <form>
                                    <input type="email" placeholder="Enter your email" className="form-control mb-2" />
                                    <button type="submit" className="btn btn-primary">Subscribe</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-dark py-2">
                    <div className="container text-center">
                        <p className="mb-0 text-white">&copy; 2024 Foodhub. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default CategoryPage
