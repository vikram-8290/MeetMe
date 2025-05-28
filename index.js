const express = require('express');
const connectDB =  require('./src/config/database');
const app = express();
const User = require('./src/models/user');
const { valdateSignUpData } = require('./src/utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {UserAuth} = require('./src/middlewares/auth');

app.use(express.json());
app.use(cookieParser());
app.post('/signup', async (req, res) => {
   
    
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

app.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = await jwt.sign({ id: user._id }, 'MeetMe@9000', { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Login successful', user });
    }
    catch (error) {
        console.error("Error logging in:", error)
        res.status(500).json({ message: 'Error logging in', error });
    }
});

app.get('/profile', UserAuth, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

app.get('/feed', async (req, res) =>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
})

app.get('/user/:id', async (req, res)=>{
    const { id } = req.params;
    try{
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
})

connectDB().then(() => {
    console.log('Database connected');
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    }
    );
})
.catch(err => {
    console.error('Database connection error:', err);
});