import React, { useRef } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import '../Single_Page/single_page.css';
import { useReactToPrint } from 'react-to-print';
import { FacebookShareButton, WhatsappShareButton, TwitterShareButton } from 'react-share'
import Button from 'react-bootstrap/esm/Button';
const SinglePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, description, image, cooktime, servingPerson, difficulty, ingredients, cookingMethod, video, tags } = location.state || {};

    const descriptionRef = useRef(null);
    const ingredientsRef = useRef(null);
    const instructionsRef = useRef(null);
    const videoRef = useRef(null);
    const cooktimeRef = useRef(null);
    const printRef = useRef(null);
    const recipeUrl = window.location.href;
    function scrollToSection(ref) {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`}>
                <SlArrowRight className="arrows" style={{ color: "gray" }} />
            </div>
        );
    }

    const SamplePrevArrow = (props) => {
        const { className, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`}>
                <SlArrowLeft className="arrows" style={{ color: "gray" }} />
            </div>
        );
    }
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: name
        // onAfterPrint: () => window.print()
    });

    const settings = {
        dots: false,
        infinite: false,
        arrows: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    return (
        <div className='bg-transparent'>
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
            <div className='parentdiv'>
                <div className='All-icons'>
                    <FacebookShareButton url={recipeUrl} quote={`Check out this recipe: ${name}`} className='mb-2'>
                        <i className="bi bi-facebook"></i>
                    </FacebookShareButton>
                    <TwitterShareButton url={recipeUrl} title={name} hashtags={["recipe", "foodhub"]} className='mb-2'>
                        <i className="bi bi-twitter"></i>
                    </TwitterShareButton>
                    <WhatsappShareButton url={recipeUrl} title={`Check out this recipe: ${name}`} className='mb-2'>
                        <i className="bi bi-whatsapp"></i>
                    </WhatsappShareButton>

                    <i class="bi bi-file-earmark-pdf-fill" onClick={handlePrint}></i>
                </div>

                <div ref={printRef} className='main-section'>
                    <div className='section-3'>
                        <div className='d-flex justify-content-start align-items-start gap-2 fs-5' onClick={() => navigate('/web/recipe_page')}>
                            <i className="bi bi-arrow-left" ></i>
                            <p className='text-start back'>Back</p>
                        </div>
                        <p className='name'>{name}</p>
                    </div>

                    <div className='d-flex w-100 justify-content-between pt-3 pb-3 align-items-center overview-buttons' style={{ borderTop: '1px solid gray', fontFamily: '"Ubuntu", sans-serif' }}>
                        <div className='d-flex justify-content-start gap-3'>
                            <button className='rounded-pill bg-white' style={{ border: '2px solid gray', fontSize: '13px', padding: '3px 13px', color: '#585858' }} onClick={() => scrollToSection(descriptionRef)}>Overview</button>
                            <button className='rounded-pill bg-white' style={{ border: '2px solid gray', fontSize: '13px', padding: '3px 13px', color: '#585858' }} onClick={() => scrollToSection(ingredientsRef)}>Ingredients</button>
                            <button className='rounded-pill bg-white' style={{ border: '2px solid gray', fontSize: '13px', padding: '3px 13px', color: "#585858" }} onClick={() => scrollToSection(cooktimeRef)}>CookTime</button>
                            <button className='rounded-pill bg-white' style={{ border: '2px solid gray', fontSize: '13px', padding: '3px 13px', color: '#585858' }} onClick={() => scrollToSection(instructionsRef)}>Instructions</button>
                        </div>
                        <i className="bi bi-play-fill" style={{ fontSize: '30px', cursor: 'pointer' }} onClick={() => scrollToSection(videoRef)}></i>
                    </div>

                    <div className=''>
                        <div style={{
                            display: image && image.length > 0 ? 'block' : 'none',
                            margin: '10px auto',
                            maxWidth: '850px'
                        }}>
                            <Slider {...settings} style={{ height: '400px', width: '100%' }}>
                                {image.map((img, index) => (
                                    <img key={index} src={img} alt={`Image ${index}`} className='single-image' />
                                ))}
                            </Slider>
                        </div>
                        <div className='tag-section'>
                            {Array.isArray(tags) && tags.map((tag, index) => (
                                <p className='tag-item' key={index}>{tag}</p>
                            ))}
                        </div>

                        <p ref={descriptionRef} className='mt-0 description1'>{description}</p>
                    </div>

                    <div className='d-flex div-3'>
                        <div ref={cooktimeRef} className="cooktime-container">
                            <div className="cooktime-image">
                                <img src='https://recipejunction.boxtasks.com/images/cooktime.png' height="45" width="45" alt="Cook Time" />
                            </div>
                            <div className="cooktime-info">
                                <p>Cook Time</p>
                                <p className='ms-4'>{cooktime}</p>
                            </div>
                        </div>
                        <div className="cooktime-container">
                            <div className="cooktime-image">
                                <img src='https://recipejunction.boxtasks.com/images/serving.png' height="45" width="45" alt="Serving Person" />
                            </div>
                            <div className="cooktime-info">
                                <p>Serving Person</p>
                                <p style={{ marginLeft: '55px' }}>{servingPerson}</p>
                            </div>
                        </div>
                        <div className="cooktime-container">
                            <div className="cooktime-image">
                                <img src='https://recipejunction.boxtasks.com/images/difficulty.png' height="45" width="45" alt="Difficulty" />
                            </div>
                            <div className="cooktime-info">
                                <p>Difficulty</p>
                                <p className='ms-2 text-capitalize'>{difficulty}</p>
                            </div>
                        </div>
                    </div>

                    <div ref={ingredientsRef} className='ingredients rounded mt-4'>
                        <p className='m-3 fs-4 Ingredient'>INGREDIENTS</p>
                        <hr className='m-3'></hr>
                        <ul>
                            {Array.isArray(ingredients) && ingredients.map((ingredient, index) => (
                                <li className='ingredient-list' key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>

                    <div ref={instructionsRef} className='instructions rounded mt-4'>
                        <p className='m-3 fs-4 Instruction'>INSTRUCTIONS</p>
                        <hr className='m-3'></hr>
                        <div>
                            <span dangerouslySetInnerHTML={{ __html: cookingMethod }}></span>
                        </div>
                    </div>

                    <video ref={videoRef} controls className='video1'>
                        <source src={video} type="video/mp4" />
                    </video>
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
    );
}

export default SinglePage;
