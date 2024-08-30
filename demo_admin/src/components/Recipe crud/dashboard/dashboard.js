import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../dashboard/dashboard.css';
import BASE_URL from '../../../config/config';

const Dashboard = () => {
    const [count, setCount] = useState(0);
    const [receipeCount, setReceipeCount] = useState(0);
    const [tagsCount, setTagsCount] = useState(0);

    useEffect(() => {
        const fetchCategoryCount = async () => {
            try {
                const token = window.localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/count`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCount(response.data.count);
            } catch (error) {
                console.error('Error fetching category count:', error);
            }
        };

        fetchCategoryCount();
    }, []);

    useEffect(() => {
        const fetchReceipeCount = async () => {
            try {
                const token = window.localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/recipe/countRecipes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setReceipeCount(response.data.count); // Fixed to setReceipeCount
            } catch (error) {
                console.error('Error fetching recipe count:', error);
            }
        };

        fetchReceipeCount();
    }, []);
    useEffect(() => {
        const fetchTagsCount = async () => {
            try {
                const token = window.localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/tags/countTags`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTagsCount(response.data.count); // Fixed to setReceipeCount
            } catch (error) {
                console.error('Error fetching tags count:', error);
            }
        };

        fetchTagsCount();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title">Categories</h1>
                    <p className="card-content">Count: {count}</p>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title">Recipes</h1>
                    <p className="card-content">Count: {receipeCount}</p>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title">Tags</h1>
                    <p className="card-content">Count: {tagsCount}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
