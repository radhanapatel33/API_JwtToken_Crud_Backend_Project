import express from 'express';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
const router = express.Router();
import userModel from '../models/users.models.js';
import jwt from 'jsonwebtoken';
dotenv.config()

//JWT = json web token

// register 

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let existData = await userModel.findOne({ $or: [{ username }, { email }] });
        if (existData) return res.status(404).json({ message: 'username and useremail already exist.' });


        let newPassword = await bcrypt.hash(password, 10);
        let data = new userModel({ username, email, password: newPassword });
        let result = await data.save();

        res.json(result);

    }
    catch (error) {
        res.status(500).json({ message: error.message });

    }
});

// login

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User Not Found' });

        const userPassword = await bcrypt.compare(password, user.password);
        if (!userPassword) return res.status(404).json({ message: 'Password Not Match' });

        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        res.json({ jwtToken });

    }
    catch (error) {
        res.status(500).json({ message: error.message });

    }

})
// logout

router.post('/logout', (req, res) => {
    res.json({ message: "Loggout Successfully" })

});

export default router;