const express = require('express');
const CreateReceipeModel = require('../models/createReceipe');
const Category = require('../models/users');
const Tag = require('../models/tag');
const ReceipeModel = require('../models/receipeUser'); // Assuming this is the model for user data
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const UserModel = require('../models/users');
const router = express.Router();
const app = express();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const SERVER_IP = '192.168.1.7';
const PORT = 3001;

const upload = multer({ storage });

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

// Route to create a recipe
router.post('/createReceipe', authenticate, upload.array('image'), async (req, res) => {
    try {
        const { name, description, difficulty, ingredients, cookingMethod, cooktime, servingPerson, video, userId, category, tags } = req.body;

        // Log the IDs
        console.log('Category ID:', category);
        console.log('Tags ID:', tags);

        // Find category and tags and user name
        const cat_name = await Category.findById(category);
        const tag_names = await Tag.find({ '_id': { $in: tags } }); // Fetch multiple tags
        const user_names = await ReceipeModel.findById(userId); // Fetch multiple tags

        // Log the results
        console.log('Category Name:', cat_name);
        console.log('Tag Names:', tag_names);

        // Validate existence of category and tags
        if (!cat_name) {
            return res.status(400).json({ message: 'Category not found' });
        }
        if (tag_names.length !== tags.length) {
            return res.status(400).json({ message: 'One or more tags not found' });
        }

        const image = req.files ? req.files.map(file => file.filename) : [];
        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        // Extract tag names
        const tagNames = tag_names.map(tag => tag.name);

        // Create new recipe
        const newRecipe = new CreateReceipeModel({
            name,
            description,
            difficulty,
            ingredients,
            cookingMethod,
            cooktime,
            servingPerson,
            image,
            video,
            userId,
            category,
            category_name: cat_name.name,
            tags,
            tag_names: tagNames, // Store the array of tag names
            user_name: user_names.name, // Store the array of tag names
        });

        const recipe = await newRecipe.save();

        // Update recipe image URL
        if (recipe.image) {
            recipe.image = `https://cooking-9.onrender.com/public/images/${recipe.image}`;
        }

        res.json({
            message: 'Recipe created successfully',
            recipe
        });
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Route to get recipes for a specific user
router.get('/getRecipe', authenticate, async (req, res) => {
    try {
        const userId = req.userId; // Assuming authenticate middleware adds user to req object
        const { tags, category } = req.query; // Extract tags and category from query parameters

        // Fetch enabled categories
        const enabledCategories = await Category.find({ status: 'Enable' }).select('_id');

        // Create filter object
        let filter = { userId };

        if (category) {
            // Ensure category is enabled before filtering
            const isCategoryEnabled = enabledCategories.some(cat => cat._id.toString() === category);
            if (!isCategoryEnabled) {
                // If category is not enabled, return an empty result
                return res.json([]);
            }
            filter.category = category;
        }

        if (tags) {
            // Convert tags query parameter to an array if it's a string
            const tagsArray = tags.split(','); // Assuming tags are comma-separated in query
            filter.tags = { $in: tagsArray }; // Filter recipes where any of the tags match
        }

        // Find recipes for the authenticated user and with optional filters
        const recipes = await CreateReceipeModel.find(filter);

        // Filter out recipes with disabled categories
        const filteredRecipes = recipes.filter(recipe =>
            enabledCategories.some(cat => cat._id.toString() === recipe.category.toString())
        );

        // Map recipes to include full image path
        const recipesWithFullImagePath = filteredRecipes.map(recipe => {
            if (Array.isArray(recipe.image)) {
                recipe.image = recipe.image.map(img => `https://cooking-9.onrender.com/public/images/${img}`);
            } else if (recipe.image) {
                recipe.image = `https://cooking-9.onrender.com/public/images/${recipe.image}`;
            }
            return recipe;
        });

        res.json(recipesWithFullImagePath);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getRecipes', authenticate, async (req, res) => {
    try {
        const { tags, category_name } = req.query;
        const enabledCategories = await Category.find({ status: 'Enable' }).select('name');

        let filter = {};

        if (category_name) {

            const isCategoryEnabled = enabledCategories.some(cat => cat.name === category_name);
            if (!isCategoryEnabled) {
                return res.json([]);
            }
            filter.category_name = category_name;
        }

        if (tags) {
            const tagsArray = tags.split(',');
            filter.tags = { $in: tagsArray };
        }
        const recipes = await CreateReceipeModel.find(filter);

        const filteredRecipes = recipes.filter(recipe =>
            enabledCategories.some(cat => cat.name === recipe.category_name)
        );

        const recipesWithFullImagePath = filteredRecipes.map(recipe => {
            if (Array.isArray(recipe.image)) {
                recipe.image = recipe.image.map(img => `https://cooking-9.onrender.com/public/images/${img}`);
            } else if (recipe.image) {
                recipe.image = `https://cooking-9.onrender.com/public/images/${recipe.image}`;
            }
            return recipe;
        });

        res.json(recipesWithFullImagePath);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





// Route to get user data
router.get('/getUser', authenticate, async (req, res) => {
    try {
        const user = await ReceipeModel.findById(req.userId, { name: 1, email: 1 });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/getAllUsers', authenticate, async (req, res) => {
    try {
        // Fetch all recipes
        const recipes = await CreateReceipeModel.find({});

        if (!recipes.length) {
            return res.status(404).json({ message: 'No recipes found' });
        }

        // Extract userIds from the recipes
        const userIds = recipes.map(recipe => recipe.userId);

        // Fetch user details for the extracted userIds
        const users = await ReceipeModel.find({ _id: { $in: userIds } }, 'name email');

        // Create a mapping of userId to user details
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user.name;
        });

        // Attach user details to each recipe
        const recipesWithUserDetails = recipes.map(recipe => ({
            ...recipe._doc,
            userId: userMap[recipe.userId] || null
        }));

        console.log(recipesWithUserDetails, "recipes with user details.....");

        res.json(recipesWithUserDetails);
    } catch (error) {
        console.error('Error fetching recipes data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




router.get('/getReceipe/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        const recipe = await CreateReceipeModel.findById(id);

        if (recipe) {
            // Construct image URLs if the image field is an array
            if (Array.isArray(recipe.image)) {
                recipe.image = recipe.image.map(img => `https://cooking-9.onrender.com/public/images/${img}`);
            } else if (recipe.image) {
                recipe.image = [`https://cooking-9.onrender.com/public/images/${recipe.image}`];
            }

            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        console.error('Error fetching recipe:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/updateUser/:id', authenticate, upload.array('image'), async (req, res) => {

    const updateData = {
        name: req.body.name,
        description: req.body.description,
        difficulty: req.body.difficulty,
        video: req.body.video,
        cookingMethod: req.body.cookingMethod,
        servingPerson: req.body.servingPerson,
        cooktime: req.body.cooktime,
        ingredients: req.body.ingredients,
        category: req.body.category,
        category_name: req.body.category_name,
        tags: req.body.tags,
        tag_names: req.body.tag_names,
    };

    if (req.files && req.files.length > 0) {
        updateData.image = req.files.map(file => file.filename); // Handle multiple files if applicable
    }

    try {
        const id = req.params.id;
        const user = await CreateReceipeModel.findByIdAndUpdate(id, updateData, { new: true });

        if (user) {
            if (Array.isArray(user.image)) {
                user.image = user.image.map(img => `https://cooking-9.onrender.com/public/images/${img}`);
            } else if (user.image) {
                user.image = `https://cooking-9.onrender.com/public/images/${user.image}`;
            }
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/deleteUser/:id', authenticate, async (req, res) => {
    const id = req.params.id;

    try {
        const user = await CreateReceipeModel.findByIdAndDelete(id);

        if (user) {
            res.json({ message: "User deleted successfully", user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/deleteImage', authenticate, async (req, res) => {
    const { filename } = req.query; // Read from req.query for DELETE requests

    if (!filename || typeof filename !== 'string') {
        return res.status(400).send('Invalid filename');
    }

    const filePath = path.resolve('public/images', filename);
    console.log('File path:', filePath);

    try {
        // Delete the image file from the folder
        fs.unlink(filePath, async (err) => {
            if (err) return res.status(500).send(`Error deleting file: ${err.message}`);

            // Remove the image record from the database
            try {
                await CreateReceipeModel.updateMany(
                    { 'image': filename }, // Adjust the query based on your schema
                    { $pull: { image: filename } }
                );
                res.send('File deleted successfully');
            } catch (dbErr) {
                res.status(500).send(`Error updating database: ${dbErr.message}`);
            }
        });
    } catch (error) {
        res.status(500).send(`Unexpected error: ${error.message}`);
    }
});
router.get('/countRecipes', authenticate, (req, res) => {
    const userId = req.userId;

    CreateReceipeModel.countDocuments({ userId })
        .then(count => res.json({ count }))
        .catch(err => res.status(500).json({ error: 'Failed to get count for userId', details: err }));
});


module.exports = router;
