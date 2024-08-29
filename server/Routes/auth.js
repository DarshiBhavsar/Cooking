const express = require('express');
const ReceipeModel = require('../models/receipeUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password
        const hash = await bcrypt.hash(password, 10);

        // Create the user with hashed password
        const user = await ReceipeModel.create({ name, email, password: hash });

        // Send the created user as a response
        res.json(user);
    } catch (err) {
        // Handle errors
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await ReceipeModel.findOne({ email: email });

        if (user) {
            // Compare the password
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Generate a token
                const token = jwt.sign({ id: user._id }, "jwt-secret-key", { expiresIn: '1d' });

                // Set the token in a cookie
                res.cookie('token', token);

                // Respond with success
                res.json({
                    status: true,
                    message: "Login successful",
                    token: token,
                    id: user._id,
                });
            } else {
                res.status(400).json({ message: 'The password is incorrect' });
            }
        } else {
            res.status(404).json({ message: 'No record existed' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;
