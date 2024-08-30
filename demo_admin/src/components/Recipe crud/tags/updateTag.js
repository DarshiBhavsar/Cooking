import React, { useEffect, useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { MdModeEdit } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../../config/config';

const UpdateTag = () => {
    // const { id } = useParams();
    const location = useLocation();
    const { id } = location.state || {};
    const [name, setName] = useState('');
    const navigate = useNavigate();

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
        axios.get(`${BASE_URL}/tags/getTag/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(result => {
                setName(result.data.name);
            })
            .catch(err => console.log(err));
    }, [id]);

    const update = (e) => {
        e.preventDefault();
        const token = window.localStorage.getItem('token');
        const data = { name };

        axios.put(`${BASE_URL}/tags/updateTag/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(result => {
                console.log('Update response:', result);
                notify();
                navigate('/dashboard/tags');
            })
            .catch(err => console.log(err));
    };


    return (
        <div className="full-screen-container">
            <Col xs={12} md={8} lg={6}>
                <h2 className="form-title">Update Tag</h2>
                <Form onSubmit={update}>
                    <Form.Group htmlFor="formName" className="form-control1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            id='formName'
                            placeholder="Enter name"
                            name='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="submit-button">
                        Update
                    </Button>
                </Form>
            </Col>
        </div>
    );
};

export default UpdateTag;
