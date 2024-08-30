import React, { useEffect, useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../CreateUser/createUser.css';
import { MdModeEdit } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../../config/config';

const UpdateUser = () => {
    // const { id } = useParams();
    const location = useLocation();
    const { id } = location.state || {};
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };
    const notify = () => toast.success('Update successful!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        axios.get(`${BASE_URL}/getUser/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                setName(result.data.name);
                setImage(result.data.image);
                setDescription(result.data.description);
                setStatus(result.data.status);
                setImagePreview(result.data.image ? result.data.image : null);
            })
            .catch(err => console.log(err));
    }, [id]);

    const update = (e) => {
        const token = window.localStorage.getItem('token');
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('image', image);

        axios.put(`${BASE_URL}/updateUser/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                console.log(result);
                notify()
                navigate('/dashboard/categories');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="full-screen-container">
            <Col xs={12} md={8} lg={6}>
                <h2 className="form-title">Update Category</h2>
                <Form onSubmit={update}>
                    <Form.Group htmlFor="formName" className="form-control1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            id='formName'
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group htmlFor="formFile" className="form-control1">
                        <Form.Label>Image</Form.Label>
                        <div className="image-preview-container">
                            {imagePreview && (
                                <div className="image-preview-wrapper">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="image-preview"
                                    />
                                    <div className="image-edit-icon" onClick={() => document.getElementById('fileInput').click()}>
                                        <MdModeEdit size={16} />
                                    </div>
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                                id="fileInput"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group htmlFor="formDescription" className="form-control1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            id='formDescription'
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group htmlFor="formStatus" className="form-control1">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            className="form-control1"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option>select</option>
                            <option value="Enable">Enable</option>
                            <option value="Disable">Disable</option>
                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="submit-button">
                        Update
                    </Button>
                </Form>
            </Col>
        </div>
    );
};

export default UpdateUser;
