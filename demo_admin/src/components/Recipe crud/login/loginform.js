import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../login/loginform.css';
import BASE_URL from '../../../config/config';

const Loginform = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const notifySuccess = () => toast.success('Login successful!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const notifyError = (message) => toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError((prevError) => ({ ...prevError, [name]: '' })); // Clear specific field error
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };
    const validateForm = () => {
        const ValidationError = {};
        if (!email.trim()) {
            ValidationError.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            ValidationError.email = "Email is not valid";
        }
        if (!password.trim()) {
            ValidationError.password = "Password is required";
        } else if (password.length < 6) {
            ValidationError.password = "Password should be at least 6 characters";
        }
        return ValidationError;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const errors = validateForm();
        setError(errors);

        if (Object.keys(errors).length === 0) {
            axios.post(`${BASE_URL}/auth/login`, { email, password })
                .then(result => {
                    if (result.data.status === true) {
                        const { token } = result.data.token; // Adjust according to the actual structure of your response

                        // Store the token in local storage
                        window.localStorage.setItem('token', result.data.token)

                        window.localStorage.setItem('id', result.data.id)
                        notifySuccess();
                        setEmail('');
                        setPassword('');
                        navigate('/web/home_page');
                    } else {
                        notifyError('Invalid credentials. Please try again.');
                    }
                })
                .catch(err => {
                    console.error(err);
                    notifyError('An error occurred. Please try again.');
                });
        }
    };

    return (
        <Container className="login-container">
            <div className="login-card">
                <h2 className="login-heading">Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formEmail">
                        <Form.Label className="login-label">Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name='email'
                            value={email}
                            onChange={handleChange}
                            className={`login-input ${isSubmitted && error.email ? 'error' : ''}`}
                        />
                        {isSubmitted && error.email && (
                            <div className="error-message">
                                {error.email}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mt-3">
                        <Form.Label className="login-label">Password</Form.Label>
                        <div style={{ position: 'relative' }}>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                name='password'
                                value={password}
                                onChange={handleChange}
                                className={`login-input ${isSubmitted && error.password ? 'error' : ''}`}
                            />
                            <div
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>

                        {isSubmitted && error.password && (
                            <div className="error-message">
                                {error.password}
                            </div>
                        )}
                    </Form.Group>

                    <Button variant="primary" type="submit" className="login-button">
                        Login
                    </Button>
                    <Link to="/auth/register" className="text-blue-500 hover:underline" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', fontWeight: 'bold', fontSize: '15px' }}>
                        Signup
                    </Link>
                </Form>
            </div>
            <ToastContainer />
        </Container>
    );
};

export default Loginform;
