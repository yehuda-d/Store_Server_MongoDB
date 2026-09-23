const Category = require('../models/category_M');

// יצירת קטגוריה חדשה
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // בדיקה אם הקטגוריה כבר קיימת
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const newCategory = new Category({ name, description });
        await newCategory.save();
        
        res.status(201).json(newCategory); // 201 = Created
    } catch (error) {
        res.status(500).json({ error: 'Server error while creating category', details: error.message });
    }
};

// קבלת כל הקטגוריות
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching categories', details: error.message });
    }
};

// ייצוא כל הפונקציות יחד
module.exports = {
    createCategory,
    getCategories
};