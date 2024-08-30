import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CreateTag/createTag.css';
import BASE_URL from '../../../config/config';

const CreateTag = () => {
    const [tags, setTags] = useState({
        name: '',
        userId: window.localStorage.getItem('id') || ''
    });
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
        const { name, value } = e.target;
        setTags(prevTags => ({ ...prevTags, [name]: value }));
        setError(prevError => ({ ...prevError, [name]: '' }));
    };

    const validateForm = () => {
        const validationError = {};
        if (!tags.name.trim()) validationError.name = "Name is required";
        return validationError;
    };

    const submit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const errors = validateForm();
        setError(errors);

        if (Object.keys(errors).length === 0) {
            const token = window.localStorage.getItem('token');
            axios.post(`${BASE_URL}/tags/createTag`, {
                name: tags.name,
                userId: tags.userId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(result => {
                    console.log(result);
                    setTags({
                        name: '',
                        userId: window.localStorage.getItem('id') || '',
                    });
                    notify();
                    navigate('/dashboard/tags');
                })
                .catch(err => console.error(err));
        } else {
            console.error('Form contains errors.');
        }
    };

    return (
        <div className="form-container">
            <Form onSubmit={submit}>
                <Form.Group controlId="formName" className="form-control1">
                    <Form.Label className="form-label">Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name="name"
                        value={tags.name}
                        onChange={handleChange}
                        className={isSubmitted && error.name ? 'error' : ''}
                    />
                    {isSubmitted && error.name && (
                        <div className="form-error">
                            {error.name}
                        </div>
                    )}
                </Form.Group>

                <Button variant="primary" type="submit" className="submit-button mt-4">
                    Submit
                </Button>
            </Form>

        </div>
    );
};

export default CreateTag;
