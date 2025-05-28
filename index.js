const express = require('express');
const connectDB =  require('./src/config/database');
const app = express();
const User = require('./src/models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authRouter = require('./src/routes/auth');
const profileRouter = require('./src/routes/profile');

app.use(express.json());
app.use(cookieParser());

app.use("/" , authRouter);

app.use("/", profileRouter); 


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