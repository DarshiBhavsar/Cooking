import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../tags/tags.css'; // Import the CSS file
import BASE_URL from '../../../config/config';

const Tags = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = (tag) => {
        setSelectedTag(tag);
        setShow(true);
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

    const handleDelete = (id) => {
        const token = window.localStorage.getItem('token');
        axios.delete(`${BASE_URL}/tags/deleteTag/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                console.log(res);
                setTags(tags.filter(tag => tag._id !== id)); // Update state without reloading
                notify();
                handleClose(); // Close modal after deletion
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="tags-container">
            <div className="tags-card">
                <div className="tags-header">
                    <h1>Tags</h1>
                    <Link to="/dashboard/create_tag" className="tags-add-btn">Add+</Link>
                </div>
                <div className="table-wrapper1">
                    <table className="tags-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tags.map((tag) => (
                                <tr key={tag._id} className="tags-row">
                                    <td>{tag.name}</td>
                                    <td className="tags-action-buttons">
                                        <Button className="tags-update-btn" onClick={() => navigate(`/dashboard/update_tag`, {
                                            state: { id: tag._id }
                                        })}>
                                            Update
                                        </Button>
                                        <Button className="tags-delete-btn" onClick={() => handleShow(tag)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Modal for confirming deletion */}
            <Modal show={show} onHide={handleClose} centered className="tags-modal">
                <Modal.Header closeButton>
                    <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={() => handleDelete(selectedTag?._id)}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Tags;
