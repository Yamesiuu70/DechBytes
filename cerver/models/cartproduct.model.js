import { sql, connectMssqlDB } from '../config/db.js';

// Function to add a product to the cart
export async function addCartProduct(cartProductData) {
    try {
        const pool = await connectMssqlDB();
        const result = await pool.request()
            .input('productId', sql.Int, cartProductData.productId)
            .input('quantity', sql.Int, cartProductData.quantity || 1)
            .input('userId', sql.Int, cartProductData.userId)
            .query(`
                INSERT INTO CartProducts (productId, quantity, userId, created_at, updated_at)
                VALUES (@productId, @quantity, @userId, GETDATE(), GETDATE());
                SELECT SCOPE_IDENTITY() as id;
            `);
        return { id: result.recordset[0].id, ...cartProductData };
    } catch (err) {
        console.error("Error adding product to cart:", err);
        throw err;
    }
}

// Function to get cart products by userId
export async function getCartProductsByUserId(userId) {
    try {
        const pool = await connectMssqlDB();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM CartProducts WHERE userId = @userId');
        return result.recordset;
    } catch (err) {
        console.error("Error getting cart products:", err);
        throw err;
    }
}

// Function to get cart with product details
export async function getCartWithDetails(userId) {
    try {
        const pool = await connectMssqlDB();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    cp.id,
                    cp.productId,
                    cp.quantity,
                    cp.userId,
                    p.name AS productName,
                    p.price AS productPrice,
                    p.photo AS productImage,
                    p.details AS productDetails
                FROM CartProducts cp
                JOIN Products p ON cp.productId = p.id
                WHERE cp.userId = @userId
            `);
        return result.recordset;
    } catch (err) {
        console.error("Error getting cart with details:", err);
        throw err;
    }
}

// Function to get a cart product by ID
export async function getCartProductById(id) {
    try {
        const pool = await connectMssqlDB();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM CartProducts WHERE id = @id');
        return result.recordset[0];
    } catch (err) {
        console.error("Error getting cart product:", err);
        throw err;
    }
}

// Function to update cart product quantity
export async function updateCartProductQuantity(id, quantity) {
    try {
        const pool = await connectMssqlDB();
        await pool.request()
            .input('id', sql.Int, id)
            .input('quantity', sql.Int, quantity)
            .input('updated_at', sql.DateTime2, new Date())
            .query('UPDATE CartProducts SET quantity = @quantity, updated_at = @updated_at WHERE id = @id');
    } catch (err) {
        console.error("Error updating cart product quantity:", err);
        throw err;
    }
}

// Function to remove a product from the cart
export async function removeCartProduct(id) {
    try {
        const pool = await connectMssqlDB();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM CartProducts WHERE id = @id');
    } catch (err) {
        console.error("Error removing product from cart:", err);
        throw err;
    }
}

// Function to clear user's cart
export async function clearUserCart(userId) {
    try {
        const pool = await connectMssqlDB();
        await pool.request()
            .input('userId', sql.Int, userId)
            .query('DELETE FROM CartProducts WHERE userId = @userId');
    } catch (err) {
        console.error("Error clearing user cart:", err);
        throw err;
    }
}