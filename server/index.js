const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const UserModel = require('./models/users');
const ReceipeModel = require('./models/receipeUser');
const CreateReceipeModel = require('./models/createReceipe');
const userRouter = require('./Routes/auth');
const recipeRouter = require('./Routes/receipe');
const tagRouter = require('./Routes/tag');


const app = express();

const SERVER_IP = 'localhost';
// const SERVER_IP = '192.168.1.7'
const port = 3001;

// Middleware
app.use(cors({
    origin: ['https://webcreatarecipe.netlify.app'],
    // origin: ['http://localhost:3000'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/auth', userRouter);
app.use('/recipe', recipeRouter);
app.use('/tags', tagRouter);

mongoose.connect('mongodb+srv://devanshi4089:XTsmMGLm3mW24Zuu@cluster0.j9c6e.mongodb.net/userdb?retryWrites=true&w=majority&appName=Cluster0');
// mongoose.connect('mongodb://localhost:27017/crud')

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const authenticate = (req, res, next) => {
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
};

// Routes
app.post('/createUser', upload.single('image'), authenticate, (req, res) => {
    const { name, description, status, userId } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
    }

    UserModel.create({ name, description, status, image, userId })
        .then(user => {
            if (user.image) {
                user.image = `https://cooking-5.onrender.com/public/images/${user.image}`;
            }
            res.json(user);
        })
        .catch(err => res.json(err));
});

app.get('/getCategory', authenticate, (req, res) => {
    const userId = req.userId;
    UserModel.find({ userId })
        .then(users => {
            const usersWithFullImagePath = users.map(user => {
                if (user.image) {
                    user.image = `https://cooking-5.onrender.com/public/images/${user.image}`;
                }
                return user;
            });
            res.json(usersWithFullImagePath);
        })
        .catch(err => res.json(err));
});

app.get('/getCategories', authenticate, (req, res) => {
    UserModel.find({})
        .then(categories => {
            const uniqueCategories = categories.filter((category, index, self) =>
                index === self.findIndex((c) => c.name === category.name)
            );

            const categoriesWithFullImagePath = uniqueCategories.map(category => {
                if (category.image) {
                    category.image = `https://cooking-5.onrender.com/public/images/${category.image}`;
                }
                return category;
            });

            res.json(categoriesWithFullImagePath);
        })
        .catch(err => res.status(500).json(err));
});

app.get('/count', authenticate, (req, res) => {
    const userId = req.userId;

    UserModel.countDocuments({ userId })
        .then(count => res.json({ count }))
        .catch(err => res.status(500).json({ error: 'Failed to get count for userId', details: err }));
});

app.get('/getUserData', authenticate, (req, res) => {
    UserModel.find({})
        .then(users => {
            const usersWithFullImagePath = users.map(user => {
                if (user.image) {
                    user.image = `https://cooking-5.onrender.com/public/images/${user.image}`;
                }
                return user;
            });
            res.json(usersWithFullImagePath);
        })
        .catch(err => res.json(err));
});

app.get('/getUser/:id', authenticate, (req, res) => {
    const id = req.params.id;
    UserModel.findById(id)
        .then(user => {
            if (user.image) {
                user.image = `https://cooking-5.onrender.com/public/images/${user.image}`;
            }
            res.json(user);
        })
        .catch(err => res.json(err));
});

app.put('/updateUser/:id', upload.single('image'), authenticate, (req, res) => {
    const id = req.params.id;
    const updateData = {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
    };

    if (req.file) {
        updateData.image = req.file.filename;
    }

    UserModel.findByIdAndUpdate(id, updateData, { new: true })
        .then(user => {
            if (user.image) {
                user.image = `https://cooking-5.onrender.com/public/images/${user.image}`;
            }
            res.json(user);
        })
        .catch(err => res.status(500).json(err));
});

app.delete('/deleteUser/:id', authenticate, (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete(id)
        .then(user => res.json({ message: "User deleted successfully", user }))
        .catch(err => res.json(err));
});

app.listen(port, () => {
    console.log(`Server is running on http://${SERVER_IP}:${port}`);
});
