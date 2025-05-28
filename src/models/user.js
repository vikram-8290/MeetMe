const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
    },
    lastName: {
        type : String,
    },
    email: {
        type : String,
        unique: true,
    },
    password: {
        type : String,
    },
    age: {
        type : Number,
    },
    gender: {
        type : String,
    },
});
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ id: user._id }, 'MeetMe@9000', { expiresIn: '1d' });
    return token;
}
userSchema.methods.validatePassword = async function(password) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}
const User = mongoose.model('User', userSchema);
module.exports = User;