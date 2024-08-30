import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../Home_Page/Home.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import BASE_URL from '../../../config/config';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
    const [Category, setCategory] = useState([]);
    const [searchQuery1, setsearchQuery1] = useState('');
    const navigate = useNavigate();

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

    const handleCategoryClick = (category) => {
        navigate(`/web/recipe_page`, {
            state: { name: category.name },
        });
    };

    const handleSearchChange = (e) => {
        setsearchQuery1(e.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchQuery1.trim() !== '') {
            navigate(`/web/recipe_page`, {
                state: { searchQuery1 },
            });
        }
    };

    return (
        <div>
            <div className="custom-navbar-wrapper">
                <Navbar expand="lg" className="custom-navbar">
                    <div className="navbar-flex-container">
                        <Navbar.Brand href="#home" className="custom-navbar-brand">
                            <img
                                className="logo1"
                                src="https://foodhub.modeltheme.com/wp-content/themes/foodhub/images/logo.png"
                                alt="logo"
                            />
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-navbar-toggler" />

                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto list">
                                <Nav.Link as={Link} to="/web/home_page" className="custom-nav-link1">
                                    Home
                                </Nav.Link>
                                <Nav.Link as={Link} to="/web/category_page" className="custom-nav-link1">
                                    Categories
                                </Nav.Link>
                                <Nav.Link as={Link} to="/web/recipe_page" className="custom-nav-link1">
                                    Recipes
                                </Nav.Link>
                                <Nav.Link href="#contactUs" className="custom-nav-link1">
                                    ContactUs
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </div>

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto list1">
                            <Nav.Link href="#home" className="custom-nav-link2">
                                <i className="bi bi-search"></i>
                            </Nav.Link>
                            <Nav.Link href="#home" className="custom-nav-link2">
                                <i className="bi bi-person"></i>
                            </Nav.Link>
                            <Nav.Link href="#link1" className="custom-nav-link2">
                                <i className="bi bi-bag"></i>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <div className="heading">
                    <p className="p1">
                        It is even better than
                        <br />
                        an expensive cookery book
                    </p>
                    <h4 className="h4">
                        Learn how to make your favorite restaurant’s dishes
                    </h4>
                    <InputGroup className="input-group1">
                        <Form.Control
                            className="form-control3"
                            placeholder="Search Recipe..."
                            value={searchQuery1}
                            onChange={handleSearchChange}
                        />
                        <Button
                            variant="outline-secondary"
                            className="search-button"
                            onClick={handleSearchSubmit}
                        >
                            <i className="bi bi-search"></i>
                        </Button>
                    </InputGroup>
                </div>
            </div>

            <div>
                <h1 className="text-center mt-5">Recipes By Category</h1>
                <div className="category-section">
                    {Category.slice(0, 4).map((items) => (
                        <div key={items._id} onClick={() => handleCategoryClick(items)}>
                            <h4 className="text-center mt-4 category-name">{items.name}</h4>
                            <img src={items.image} alt={items.name} className="category-image" />
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <Button
                        className="text-center mt-3 m-0 h3 text-white rounded-pill bg-black"
                        onClick={() => navigate('/web/category_page')}
                        style={{ cursor: 'pointer', padding: '10px 30px' }}
                    >
                        Show All
                    </Button>
                </div>
            </div>

            <footer className="footer">
                <div className="bg-[#1d1c1c] py-4 py-md-5 py-xl-8 border-top border-light text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <h5>About Foodhub</h5>
                                <p>
                                    Foodhub is your go-to platform for discovering new recipes,
                                    cooking tips, and culinary inspiration. Whether you're a
                                    seasoned chef or just starting, we've got something delicious
                                    for you.
                                </p>
                            </div>
                            <div className="col-md-4">
                                <h5>Quick Links</h5>
                                <ul className="list-unstyled">
                                    <li>
                                        <Link to="/web/home_page" className="text-white">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/web/category_page" className="text-white">
                                            Categories
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/web/recipe_page" className="text-white">
                                            Recipes
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#contact" className="text-white">
                                            Contact Us
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-4">
                                <h5>Subscribe to Our Newsletter</h5>
                                <p>
                                    Get the latest recipes and culinary tips straight to your
                                    inbox. Sign up today!
                                </p>
                                <form>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="form-control mb-2"
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-dark py-2">
                    <div className="container text-center">
                        <p className="mb-0 text-white">
                            &copy; 2024 Foodhub. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
