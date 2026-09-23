const User = require('../models/user_M');
const { z } = require('zod');

// הגדרת סכמת הוולידציה של Zod עבור משתמש
const userValidationSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

// יצירת משתמש חדש
const createUser = async (req, res) => {
    try {
        const validation = userValidationSchema.safeParse(req.body);
        
        if (!validation.success) {
            // שימוש בפונקציה המובנית של Zod להחזרת שגיאות נקיות לפי שדות
            return res.status(400).json({ 
                error: 'Validation failed', 
                messages: validation.error.flatten().fieldErrors 
            });
        }

        const { firstName, lastName, email, password } = validation.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Server error while creating user', details: error.message });
    }
};

// קבלת כל המשתמשים (מועיל לבדיקות ב-Postman)
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching users', details: error.message });
    }
};

module.exports = {
    createUser,
    getUsers
};