import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../../config/config';

const CreateUser = () => {

    const [category, setCategory] = useState({
        name: '',
        image: null,
        description: '',
        status: '',
        userId: window.localStorage.getItem('id')
    })

    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();



    const notify = () => toast.success('Create successful!', {
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
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0]; // Get the first file
            if (file) {
                setCategory({ ...category, [name]: file });
                setImagePreview(URL.createObjectURL(file)); // Preview single image
                setError(prevError => ({ ...prevError, image: '' }));
            }
        } else {
            setCategory({ ...category, [name]: value });
            setError(prevError => ({ ...prevError, [name]: '' }));
        }
    };

    const validateForm = () => {
        const validationError = {};
        if (!category.name.trim()) validationError.name = "Name is required";
        if (!category.image) validationError.image = "At least one image is required";
        if (!category.description.trim()) validationError.description = "Description is required";
        if (!category.status.trim()) validationError.status = "Difficulty is required";
        return validationError;
    };
    // const validateForm = () => {
    //     const validationError = {};
    //     if (!name.trim()) {
    //         validationError.name = "Name is required";
    //     }
    //     if (!image) {
    //         validationError.image = "Image is required";
    //     }
    //     if (!description.trim()) {
    //         validationError.description = "Description is required";
    //     }
    //     if (!status.trim()) {
    //         validationError.status = "Status is required";
    //     }
    //     return validationError;
    // };

    const submit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const errors = validateForm();
        setError(errors);

        const formData = new FormData();
        formData.append('name', category.name);
        formData.append('image', category.image);
        formData.append('description', category.description);
        formData.append('status', category.status);
        formData.append('userId', category.userId);

        if (Object.keys(errors).length === 0) {
            const token = window.localStorage.getItem('token');
            axios.post(`${BASE_URL}/createUser`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(result => {
                    console.log(result);
                    setCategory({
                        name: '',
                        description: '',
                        image: null,
                        status: '',
                        userId: window.localStorage.getItem('id')
                    });
                    // setName('');
                    // setImage(null);
                    // setDescription('');
                    // setStatus('');
                    setImagePreview(null);
                    notify(); // Ensure this line is reached
                    navigate('/dashboard/categories');
                })
                .catch(err => console.log(err));
        } else {
            console.error('User ID is not available or form contains errors.');
        }
    };

    return (
        <div className="full-screen-container">
            <Col xs={12} md={8} lg={6}>
                <h2 className="form-title">Create Category</h2>
                <Form onSubmit={submit}>
                    <Form.Group controlId="formName" className="form-control2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            value={category.name}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.name ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        />
                        {isSubmitted && error.name && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.name}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formFile" className="form-control2">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={handleChange}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                        )}
                        {isSubmitted && error.image && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.image}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formDescription" className="form-control2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter description"
                            name="description"
                            value={category.description}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.description ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        />
                        {isSubmitted && error.description && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.description}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formStatus" className="form-control2">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            name="status"
                            value={category.status}
                            onChange={handleChange}
                            style={{
                                borderColor: isSubmitted && error.status ? 'red' : '#ced4da',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                padding: '0.375rem 0.75rem',
                            }}
                        >
                            <option>Select</option>
                            <option value="Enable">Enable</option>
                            <option value="Disable">Disable</option>
                        </Form.Select>
                        {isSubmitted && error.status && (
                            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                {error.status}
                            </div>
                        )}
                    </Form.Group>

                    <Button variant="primary" type="submit" className="submit-button1 mt-4">
                        Submit
                    </Button>
                </Form>
                {/* <ToastContainer /> */}
            </Col>
        </div>
    );
};

export default CreateUser;
