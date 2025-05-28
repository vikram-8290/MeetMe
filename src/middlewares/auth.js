const User = require('../models/user');
const jwt = require('jsonwebtoken');
const UserAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        const decode = await jwt.verify(token, 'MeetMe@9000');
        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in UserAuth middleware:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {UserAuth};