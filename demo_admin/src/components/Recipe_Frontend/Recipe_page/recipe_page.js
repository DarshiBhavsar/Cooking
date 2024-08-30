import React, { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Recipe_page/recipe_page.css'
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import BASE_URL from '../../../config/config';

const Recipepage = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const [recipes, setRecipes] = useState([]);
    const [user, setUser] = useState([]);
    const [tags, setTags] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const { name, categoryId, searchQuery1 } = location.state || {};
    const [Category, setCategory] = useState([]);
    const [searchQuery, setSearchQuery] = useState(searchQuery1 || '');
    const [selectedCategory, setSelectedCategory] = useState(name || '');
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value); // Update the selected category
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update the search query
    };
    const formatCookTime = (cookTime) => {
        // Split the cookTime by ':'
        const [hours, minutes] = cookTime.split(':').map(Number);

        // Construct formatted time string
        let formattedTime = '';
        if (hours > 0) {
            formattedTime += `${hours}H `;
        }
        if (minutes >= 0 || hours === 0) {
            if (formattedTime) {
                formattedTime += ': '; // Add colon and space if hours are present
            }
            formattedTime += `${minutes}M`;
        }

        return formattedTime.trim() || '0M';
    };

    useEffect(() => {
        const filtered = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRecipes(filtered);
    }, [searchQuery, recipes]);
    useEffect(() => {
        // Retrieve the token from local storage
        const token = window.localStorage.getItem('token');

        // Make the API request with the token in the headers
        axios.get(`${BASE_URL}/tags/getTags`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => setTags(result.data))
            .catch(err => console.log(err));
    }, []);
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`} >
                <SlArrowRight class="arrows" style={{ color: "gray" }} />
            </div>
        )
    }
    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`} >
                <SlArrowLeft class="arrows" style={{ color: "gray" }} />
            </div>
        )
    }

    const settings = {
        dots: false,
        infinite: false,
        arrows: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow to="next" />,
        prevArrow: <SamplePrevArrow to="prev" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
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
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = window.localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/recipe/getAllUsers`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setUser(response.data);
                console.log(response.data, 'user....')
            } catch (err) {
                console.log('Error fetching user:', err);
            }
        };
        const fetchRecipesData = async () => {
            try {
                const token = window.localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/recipe/getRecipes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true,
                    params: {
                        category_name: selectedCategory,

                    }
                });
                setRecipes(response.data);
            } catch (err) {
                console.log('Error fetching recipes:', err);
            }
        };
        fetchUserData()
        fetchRecipesData()
    }, [selectedCategory])
    return (
        <div>
            <div className='custom-navbar-wrapper2'>
                <Navbar expand="lg" className="custom-navbar2" sticky="top">
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
                <p className='para-1'>Category:{name || 'All Recipes'}</p>
            </div>

            <div className='div-1'>
                <input
                    type="search"
                    className="form-control Search1"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder='What are you looking for...'
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <div className="dropdown-container">
                    <select onChange={handleCategoryChange} value={selectedCategory} className="custom-select">
                        <option value=''>All Recipes</option>
                        {Category.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            <div className="recipe-grid1">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((item) => (
                        <div
                            key={item._id}
                            className="recipe-card1"
                        >
                            <div style={{ display: item.image && item.image.length > 0 ? 'block' : 'none' }}>
                                <Slider {...settings} style={{ height: '250px' }}>
                                    {item.image.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Image ${index}`}
                                        />
                                    ))}
                                </Slider>
                            </div>
                            <div onClick={() => navigate(`/web/single_page`, {
                                state: { name: item.name, description: item.description, cooktime: item.cooktime, category: item.category, cookingMethod: item.cookingMethod, difficulty: item.difficulty, ingredients: item.ingredients, servingPerson: item.servingPerson, image: item.image, video: item.video, tags: item.tag_names }
                            })}>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <p style={{ marginBottom: '3px', marginTop: '15px', fontSize: '20px' }}>{item.name}</p>
                                </div>

                                <p style={{ color: 'gray' }}>by {item.user_name || 'unknown'}</p>

                                <hr style={{ margin: '10px 0px' }}></hr>
                                <div className='section'>
                                    <div className='d-flex align-items-center gap-1' style={{ fontSize: '13px' }}>
                                        <i className="bi bi-clock"></i>
                                        <p className='mb-0'>{formatCookTime(item.cooktime)}</p>
                                    </div>

                                    <div className='d-flex align-items-center gap-1' style={{ fontSize: '13px' }}>
                                        <i class="bi bi-reception-4"></i>
                                        <p className='mb-0 text-capitalize'>{item.difficulty}</p>
                                    </div>
                                    <div className='d-flex align-items-center gap-1' style={{ fontSize: '13px' }}>
                                        <i class="bi bi-person"></i>
                                        <p className='mb-0'>{item.servingPerson}<span className='mx-2'>Person</span></p>
                                    </div>
                                </div>
                                <div style={{ display: "none" }}>
                                    {item.tag_names.map((tag, index) => (
                                        <span key={index} className='tag-badge'>{tag}</span>
                                    ))}
                                </div>

                            </div>

                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#666' }}>No recipes found.</p>
                )}

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

export default Recipepage
