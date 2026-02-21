import { sql, connectMssqlDB } from '../config/db.js';

// Function to add a product to an order
export async function addOrderProduct(orderProductData) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('order_id', sql.Int, orderProductData.order_id)
            .input('product_name', sql.NVarChar, orderProductData.product_name)
            .input('product_image', sql.NVarChar, orderProductData.product_image || null)
            .input('quantity', sql.Int, orderProductData.quantity)
            .input('price', sql.Decimal(10, 2), orderProductData.price)
            .query(`INSERT INTO OrderProducts (order_id, product_name, product_image, quantity, price)
                    VALUES (@order_id, @product_name, @product_image, @quantity, @price);
                    SELECT SCOPE_IDENTITY() as id;`);
        return result.recordset[0].id;
    } catch (err) {
        console.error("Error adding order product:", err);
        throw err;
    }
}

// Function to get order products by order ID
export async function getOrderProductsByOrderId(order_id) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('order_id', sql.Int, order_id)
            .query('SELECT * FROM OrderProducts WHERE order_id = @order_id');
        return result.recordset;
    } catch (err) {
        console.error("Error getting order products by order ID:", err);
        throw err;
    }
}

// Add more functions as needed (e.g., updateOrderProduct, deleteOrderProduct)
