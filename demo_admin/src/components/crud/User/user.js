import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../User/user.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../../config/config';

const User = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = (user) => {
        setSelectedUser(user);
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
        axios.get(`${BASE_URL}/getCategory`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => setUsers(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        const token = window.localStorage.getItem('token');
        axios.delete(`${BASE_URL}/deleteUser/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                console.log(res);
                setUsers(users.filter(user => user._id !== id)); // Update state without reloading
                notify()
                handleClose(); // Close modal after deletion
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="user-container">

            <div className="user-card">
                <div className="user-header">
                    <h1>Category</h1>
                    <Link to="/dashboard/create_category" className="add-btn">Add+</Link>
                </div>
                <div className="table-wrapper">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="user-row">
                                    <td>{user.name}</td>
                                    <td>
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="user-image"
                                        />
                                    </td>
                                    <td>{user.description}</td>
                                    <td>{user.status}</td>
                                    <td className="action-buttons">
                                        <Button className="update-btn1" onClick={() => navigate(`/dashboard/update_category`, {
                                            state: { id: user._id }
                                        })}>
                                            Update
                                        </Button>
                                        <Button className="delete-btn1" onClick={() => handleShow(user)}>
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
            <Modal show={show} onHide={handleClose} centered className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
                    {/* <Modal.Title className='title'>Confirm Deletion</Modal.Title> */}
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
        </div>
    );
};

export default User;
