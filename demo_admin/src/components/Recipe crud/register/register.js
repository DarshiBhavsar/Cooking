import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../register/register.css'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const notify = () => toast.success('Register successful!', {
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
        setError((prevError) => ({ ...prevError, [name]: '' }));
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'name') {
            setName(value);
        }
    };

    const validateForm = () => {
        const ValidationError = {};
        if (!name.trim()) {
            ValidationError.name = "Name is required";
        }
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
            axios.post('https://cooking-5.onrender.com/auth/register', { name, email, password })
                .then(response => {
                    // const { token } = response.data; // Adjust according to the actual structure of your response

                    // localStorage.setItem("token", token); // Assuming token is a string

                    setName('');
                    setEmail('');
                    setPassword('');
                    setError({});
                    notify();

                    navigate('/auth/login'); // Navigate to login after successful registration
                })
                .catch(err => {
                    console.error(err);
                    // Optionally handle server-side errors
                });
        }
    };

    return (
        <Container className="register-container">
            <div className="register-card">
                <h2 className="register-heading">Register</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label className="register-label">Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            name='name'
                            value={name}
                            onChange={handleChange}
                            className={`register-input ${isSubmitted && error.name ? 'error' : ''}`}
                        />
                        {isSubmitted && error.name && (
                            <div className="error-message">
                                {error.name}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formEmail" className="mt-3">
                        <Form.Label className="register-label">Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name='email'
                            value={email}
                            onChange={handleChange}
                            className={`register-input ${isSubmitted && error.email ? 'error' : ''}`}
                        />
                        {isSubmitted && error.email && (
                            <div className="error-message">
                                {error.email}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mt-3">
                        <Form.Label className="register-label">Password</Form.Label>
                        <div style={{ position: 'relative' }}>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                name='password'
                                value={password}
                                onChange={handleChange}
                                className={`register-input ${isSubmitted && error.password ? 'error' : ''}`}
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

                    <Button variant="primary" type="submit" className="register-button">
                        Register
                    </Button>
                </Form>
                <ToastContainer />
            </div>
        </Container>
    );
};

export default Register;
