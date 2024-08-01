const UserModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const passport=require('passport')

exports.user = async (req, res) => {
    try {
        // Ensure req.body is defined and contains required fields
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }

        const { fullName, password, email } = req.body;

        // Validate input data
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new UserModel({
            fullName,
            password: hashedPassword, // Store hashed password
            email,
        });

        // Save the new user to the database
        await newUser.save();
        console.log(newUser);

        // Respond with the newly created user and HTTP status code 201 (Created)
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        // Handle errors and respond with HTTP status code 500 (Internal Server Error)
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

 

exports.homepage = async(req, res) => {
//    const req.session.user=email
    const user=await UserModel.findOne({email:req.session.user})



    if (!req.session.user) {
        return res.status(401).json({ message: 'Permission denied,please login.' });
    }

    res.status(200).json({ message: 'Welcome to my homepage! ' + user.fullName[0].toUpperCase() + user.fullName.slice(1).toLowerCase()+'.' });
};
 

exports.login = async (req, res) => {
    try {
        const { email, Password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatched = await bcrypt.compare(Password, user.password);
        if (!isMatched) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        req.session.user = user.email; // Set user ID in session


        const { _id, password: pwd, ...other } = user._doc;
        res.status(200).json({ message: 'Login successful', data: other });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout=async(req,res)=>{
   try {
    req.session.destroy()
    res.status(200).json({message:'successfully log out'})
   } catch (error) {
    res.status(500).json(error.message)
   }
}

exports.googlesignUp=  passport.authenticate('google', { scope: ['email','profile'] });

exports.redirect=passport.authenticate('google',{
    successRedirect:"/api/v1/auth/google/success",
    failureRedirect:"/api/v1/auth/google/failure"
})
