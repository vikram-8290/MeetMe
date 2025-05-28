const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const { valdateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');


authRouter.post('/signup', async (req, res) => {
    try {
         const { isValid, errors } = valdateSignUpData(req);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        
        const { firstName, lastName, email, password, age } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age
        });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error creating user:", error)
        res.status(500).json({ message: 'Error creating user', error });
    }
});

authRouter.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = await user.getJWT();
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Login successful', user });
    }
    catch (error) {
        console.error("Error logging in:", error)
        res.status(500).json({ message: 'Error logging in', error });
    }
});

module.exports = authRouter;