import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import '../ReceipeUser/receipeUser.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdEdit } from "react-icons/md";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import BASE_URL from '../../../config/config';

const ReceipeUser = () => {
    const navigate = useNavigate()
    const [recipes, setRecipes] = useState([]);
    const [user, setUser] = useState(null);
    const [Tag, setTag] = useState([]);
    const [category, setCategory] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(''); // S
    const [selectedtag, setSelectedtag] = useState(''); // S
    const handleClose = () => setShow(false);
    const handleShow = (user) => {
        setSelectedUser(user);
        setShow(true);
    };
    const handleTagChange = (e) => {
        setSelectedtag(e.target.value); // Update the selected category
    };
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value); // Update the selected category
    };
    const notify = () => toast.success('Delete successful!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
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
        axios.get(`${BASE_URL}/tags/getTags`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => setTag(result.data))
            .catch(err => console.log(err));
    }, []);
    useEffect(() => {
        const token = window.localStorage.getItem('token');
        axios.get(`${BASE_URL}/getCategory`, {
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
                const response = await axios.get(`${BASE_URL}/recipe/getUser`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setUser(response.data);
            } catch (err) {
                console.log('Error fetching user:', err);
            }
        };

        const fetchRecipesData = async () => {
            try {
                const token = window.localStorage.getItem('token');

                const response = await axios.get(`${BASE_URL}/recipe/getRecipe`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true,
                    params: {
                        tags: selectedtag,
                        category: selectedCategory
                    }
                });
                setRecipes(response.data);
            } catch (err) {
                console.log('Error fetching recipes:', err);
            }
        };

        fetchUserData();
        fetchRecipesData();
    }, [selectedtag, selectedCategory]);

    const handleDelete = (id) => {
        const token = window.localStorage.getItem('token');
        axios.delete(`${BASE_URL}/recipe/deleteUser/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                setRecipes(recipes.filter(recipe => recipe._id !== id));
                handleClose();
                notify();  // Notify after successful deletion
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container-fluid" style={{ padding: '20px' }}>
            {user ? (
                <div className="receipe-card">
                    <h3>{user.name || 'No Name Available'}</h3>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <div className='section'>
                <Link to="/dashboard/create_receipe" className="add-btn">
                    Add+
                </Link>
                <div className='section-2'>
                    <div className="dropdown-container">
                        <select onChange={handleCategoryChange} value={selectedCategory} className="custom-select">
                            <option value="">All Categories</option>
                            {category.map((option, index) => (
                                <option key={index} value={option._id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        <select onChange={handleTagChange} value={selectedtag} className="custom-select">
                            <option value="">All Recipes</option>
                            {Tag.map((option, index) => (
                                <option key={index} value={option._id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>


            </div>

            <div className="recipe-grid">
                {recipes.length > 0 ? (
                    recipes.map((item) => (
                        <div
                            key={item._id}
                            className="recipe-card"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ marginBottom: '0rem', fontSize: '20px' }}><strong>Name:</strong> {item.name}</p>
                                <Button onClick={() => navigate(`/dashboard/update_receipe`, {
                                    state: { id: item._id }
                                })} className="update-btn"><MdEdit size={20} /></Button>

                            </div>

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


                            <p className='fs-5 mt-3'><strong>Description:</strong> {item.description}</p>
                            <p className='fs-5'><strong>Cooktime:</strong> {item.cooktime}</p>
                            <p className='fs-5'><strong>Category:</strong> {item.category_name}</p>
                            <p className='fs-5 mb-0'><strong>Cooking Method:</strong> <span dangerouslySetInnerHTML={{ __html: item.cookingMethod }}></span></p>
                            <p className='fs-5'><strong>Difficulty:</strong> {item.difficulty}</p>
                            <p className='fs-5 mb-0'><strong>Ingredients:</strong></p>
                            <ul className='fs-5'>
                                {Array.isArray(item.ingredients) ? (
                                    item.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))
                                ) : (
                                    item.ingredients && item.ingredients.split(',').map((ingredient, index) => (
                                        <li key={index}>{ingredient.trim()}</li>
                                    ))
                                )}
                            </ul>
                            <p className='fs-5'><strong>Serving Person:</strong> {item.servingPerson}</p>
                            {item.video && (
                                <video controls className='video'>
                                    <source src={item.video} type="video/mp4" />
                                </video>
                            )}

                            <Button className="delete-btn" onClick={() => handleShow(item)}>
                                Delete
                            </Button>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#666' }}>No recipes found.</p>
                )}
            </div>
            <Modal show={show} onHide={handleClose} centered className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={() => handleDelete(selectedUser?._id)}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* <ToastContainer /> */}
        </div>
    );
}

export default ReceipeUser;
