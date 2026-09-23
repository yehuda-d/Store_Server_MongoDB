const Order = require('../models/order_M');
const Product = require('../models/product_M');
const { z } = require('zod');

// סכמת וידוא נתונים ליצירת הזמנה עם Zod (השלמת דרישה)
const orderValidationSchema = z.object({
    user: z.string().length(24, "Invalid user ID format"),
    products: z.array(
        z.object({
            product: z.string().length(24, "Invalid product ID format"),
            quantity: z.number().min(1, "Quantity must be at least 1")
        })
    ).min(1, "Order must contain at least one product")
});

// יצירת הזמנה חדשה
const createOrder = async (req, res) => {
    try {
        // שימוש ב-Zod כפי שנדרש
        const validation = orderValidationSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                messages: validation.error.flatten().fieldErrors 
            });
        }

        const { user, products } = validation.data; 
        let totalPrice = 0;

        for (let item of products) {
            const productDoc = await Product.findById(item.product);
            if (!productDoc) {
                return res.status(404).json({ error: `Product with ID ${item.product} not found` });
            }
            if (productDoc.stock < item.quantity) {
                return res.status(400).json({ error: `Not enough stock for product: \({productDoc.name}. Available:\){productDoc.stock}` });
            }
            totalPrice += productDoc.price * item.quantity;
        }

        for (let item of products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity } 
            });
        }

        const newOrder = new Order({ user, products, totalPrice });
        await newOrder.save();
        res.status(201).json(newOrder);

    } catch (error) {
        res.status(500).json({ error: 'Server error while creating order', details: error.message });
    }
};

// קבלת הזמנות (כולל סינון לפי משתמש ספציפי - השלמת דרישה)
const getOrders = async (req, res) => {
    try {
        const { userId } = req.query; 
        
        // אם הועבר מזהה משתמש, נסנן רק את ההזמנות שלו. אחרת נביא הכל.
        const filter = userId ? { user: userId } : {};

        const orders = await Order.find(filter)
            .populate('user', 'firstName lastName email') 
            .populate('products.product', 'name price'); 
            
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching orders', details: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders
};