// ==========================================
// מטלת סיום – MongoDB: שרת לניהול חנות וירטואלית
// מגיש: יהודה דייויס
// ת"ז: [208912949]
// ==========================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware המאפשר לשרת לקרוא מידע בפורמט JSON מבקשות Postman
app.use(express.json());

// חיבור למסד הנתונים MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));

// נתיב בסיסי לבדיקה שהשרת עובד
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Virtual Store API' });
});

// חיבור נתיבי המערכת (Routes)
const categoryRoutes = require('./routes/category_R');
const userRoutes = require('./routes/user_R');
const productRoutes = require('./routes/product_R');
const orderRoutes = require('./routes/order_R');

app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


// הפעלת השרת
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


