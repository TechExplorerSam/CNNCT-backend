const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserPreferences=require('../models/UserPreferences')
exports.loginExisitngUser = async (req, res) => {
    try {
         console.log("Request Body:", req.body);
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json("User Not Found in the Database , please try again check your login credentials or Register");
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {     
                return res.status(400).json("Invalid Password");   
              }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
        res.header('Authorization', token).json({
            message: 'User Logged in Successfully',
            _id: user._id,
            username: user.username,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.registernewUser = async (req, res) => {
    try {
        console.log(" Request Body:", req.body);

        const { firstName, lastName, username, email, password, confirmPassword, preferences } = req.body;

        if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !preferences) {
            console.error(" Missing required fields!");
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            console.error(" Invalid Email Format");
            return res.status(400).json({ message: "Invalid Email" });
        }

        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
            console.error(" Invalid Password Format");
            return res.status(400).json({ message: "Password must be at least 6 characters long and contain one uppercase letter, one lowercase letter, and one number." });
        }

        console.log("Passed Validations");

        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(" Password Hashed");

        const user = new User({
            firstName,
            lastName,
            username,
            email,
            preferences,
            password: hashedPassword,
            confirmPassword: hashedPassword,
        });

        await user.save();
        console.log(" User Saved:", user);

        const userPreferences = new UserPreferences({
            user_id: user._id,
            Userpreferences: preferences,
        });

        await userPreferences.save();
        console.log(" User Preferences Saved:", userPreferences);

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        console.log("🔐 JWT Token Generated");

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                preferences: user.preferences,
            },
            token,
        });

    } catch (error) {
        console.error(" Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
exports.getUserDetails=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.UpdateExistingUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            console.error("Missing required fields!");
            return res.status(400).json({ message: "First Name and Last Name are required" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.firstName = firstName;
        user.lastName = lastName;

        await user.save(); 

        res.status(200).json({ message: "User updated successfully", user });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getEventsforUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('events');
        res.status(200).json(user.events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.addanEventToUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.events.push(req.body.eventId);
        await user.save();
        res.status(200).json(user.events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.logouttheUser=async (req, res) => {
    try {
        res.header('auth-token', null).json("User Logged out Sucessfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.UpdateEmailOrPasswordorBothOfUser = async (req) => { 
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new Error("User Not Found in database"); 
    }

    let isUpdated = false;

    if (req.body.email && user.email !== req.body.email) {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(req.body.email)) {
            throw new Error("Invalid Email Format. Please Correct It");
        }
        user.email = req.body.email;
        isUpdated = true;
    }

    if (req.body.password) {
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(req.body.password)) {
            throw new Error("Invalid Password Format.");
        }
        const newPassword = await bcrypt.hash(req.body.password, 12);
        user.password = newPassword;
        user.confirmPassword = newPassword;
        isUpdated = true;
    }

    if (isUpdated) {
        await user.save();
    } else {
        throw new Error("No changes detected");
    }

    return user; 
};

