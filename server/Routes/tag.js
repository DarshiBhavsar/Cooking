const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const Tags = require('../models/tag');
const router = express.Router();

const SERVER_IP = '192.168.1.2';
const PORT = 3001;

const authenticate = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Assuming Bearer <token>

    if (!token) {
        return res.status(401).json({ Status: 'No token provided' });
    }

    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ Status: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        next();
    });
}

// Apply the authenticate middleware to the /createTag route
router.post('/createTag', authenticate, (req, res) => {
    console.log(req.body); //
    const { name, userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
    }

    Tags.create({ name, userId })
        .then(tag => {
            res.json(tag);
        })
        .catch(err => res.json(err));
});

router.get('/getTags', authenticate, (req, res) => {
    const userId = req.userId;
    Tags.find({ userId })
        .then(tag => {
            res.json(tag);
        })
        .catch(err => res.json(err));
})
router.delete('/deleteTag/:id', authenticate, (req, res) => {
    const id = req.params.id;
    Tags.findByIdAndDelete(id)
        .then(tag => res.json({ message: "Tag deleted successfully", tag }))
        .catch(err => res.json(err));
});
router.get('/getTag/:id', authenticate, (req, res) => {
    const id = req.params.id;
    Tags.findById(id)
        .then(tag => {
            res.json(tag);
        })
        .catch(err => res.json(err));
});
router.put('/updateTag/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const updateData = {
        name: req.body.name,
    };
    Tags.findByIdAndUpdate(id, updateData, { new: true })
        .then(tag => {
            res.json(tag);
        })
        .catch(err => res.status(500).json(err));
});
router.get('/countTags', authenticate, (req, res) => {
    const userId = req.userId;
    Tags.countDocuments({ userId })
        .then(count => res.json({ count }))
        .catch(err => res.status(500).json({ error: 'Failed to get count for userId', details: err }));
});


module.exports = router;
