const Product = require('../models/product_M');
const Category = require('../models/category_M');
const { z } = require('zod');

// סכמת וידוא נתונים ליצירת מוצר עם Zod
const productValidationSchema = z.object({
    name: z.string().min(2, "Product name is required"),
    description: z.string().optional(),
    price: z.number().min(0.01, "Price must be greater than 0"),
    stock: z.number().min(0, "Stock cannot be negative"),
    category: z.string().length(24, "Invalid category ID format") // ObjectId במונגו הוא תמיד 24 תווים
});

// 1. יצירת מוצר (Create)
const createProduct = async (req, res) => {
    try {
        const validation = productValidationSchema.safeParse(req.body);
        if (!validation.success) {
            // שימוש ב-flatten שראינו שעובד מצוין כדי להחזיר שגיאות נקיות
            return res.status(400).json({ 
                error: 'Validation failed', 
                messages: validation.error.flatten().fieldErrors 
            });
        }

        const { name, description, price, stock, category } = validation.data;

        // לפני שניצור מוצר, נוודא שהקטגוריה שקיבלנו אכן קיימת במסד הנתונים
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const newProduct = new Product({ name, description, price, stock, category });
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Server error while creating product', details: error.message });
    }
};

// 2. קבלת מוצרים (Read) - משלב Query ו-Populate
const getProducts = async (req, res) => {
    try {
        const { categoryId, count } = req.query; // דרישת המטלה: שימוש ב-query

        // אם שלחו ב-query בקשה לספור מוצרים בקטגוריה מסוימת: ?categoryId=123&count=true
        if (categoryId && count === 'true') {
            const productsCount = await Product.countDocuments({ category: categoryId });
            return res.status(200).json({ categoryId, count: productsCount });
        }

        // אם שלחו רק מזהה קטגוריה ב-query, נחפש רק מוצרים שלה. אחרת, נביא את כולם.
        const filter = categoryId ? { category: categoryId } : {};

        // שימוש ב-populate כדי להביא את פרטי הקטגוריה המלאים ולא רק את ה-ID שלה
        const products = await Product.find(filter).populate('category', 'name description');
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching products', details: error.message });
    }
};

// 3. עדכון מוצר (Update)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // { new: true } גורם לפונקציה להחזיר את המוצר המעודכן ולא את הישן
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Server error while updating product', details: error.message });
    }
};

// 4. מחיקת מוצר (Delete)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Server error while deleting product', details: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
};