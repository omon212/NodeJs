const express = require('express');
const User = require('../models/user');
const router = express.Router();

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Incorrect username or password
 *       500:
 *         description: Server error
 */
router.post('/login/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Username and password are required!" });
    }

    try {
        let user = await User.findOne({ username, password });
        if (!user) {
            return res.status(400).json({ msg: "Incorrect username or password!" });
        }

        res.status(200).json({
            msg: "User logged in successfully!",
            userData: user
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - phone_number
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           description: User's password
 *         phone_number:
 *           type: string
 *           description: User's phone number
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/register/', async (req, res) => {
    const { username, password, phone_number } = req.body;

    if (!username || !password || !phone_number) {
        return res.status(400).json({ msg: "Username, password, and phone number are required!" });
    }

    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: "User already exists" });

        user = new User({ username, password, phone_number });
        await user.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});


/**
 * @swagger
 * /user/delete/{username}:
 *   delete:
 *     summary: Delete a user by username
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       400:
 *         description: Username is required
 *       404:
 *         description: User does not exist
 *       500:
 *         description: Server error
 */
router.delete('/delete/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ msg: "Username is required." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: "User does not exist." });
        }

        await user.deleteOne();
        res.status(200).json({ msg: "User successfully deleted." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});


module.exports = router;