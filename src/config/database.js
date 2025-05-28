const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://singhvikramsisodiya8290:kX7rBt5sXvuvppdl@cashkaka.9adbw6g.mongodb.net/MeetMe");
        console.log("MongoDB connected...");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }

}
module.exports = connectDB;