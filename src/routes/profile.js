const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const { UserAuth } = require('../middlewares/auth');

profileRouter.get('/profile', UserAuth, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

module.exports = profileRouter;