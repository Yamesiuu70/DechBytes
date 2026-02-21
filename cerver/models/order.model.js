import { sql, connectMssqlDB } from '../config/db.js';

// Function to create a new order
export async function createOrder(orderData) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('userId', sql.Int, orderData.userId)
            .input('orderId', sql.NVarChar, orderData.orderId)
            .input('paymentId', sql.NVarChar, orderData.paymentId || '')
            .input('payment_status', sql.NVarChar, orderData.payment_status || 'pending')
            .input('delivery_name', sql.NVarChar, orderData.delivery_address.name)
            .input('delivery_email', sql.NVarChar, orderData.delivery_address.email)
            .input('delivery_phone', sql.NVarChar, orderData.delivery_address.phone)
            .input('delivery_address_line', sql.NVarChar, orderData.delivery_address.address)
            .input('subTotalAmt', sql.Decimal(10, 2), orderData.subTotalAmt || 0)
            .input('totalAmt', sql.Decimal(10, 2), orderData.totalAmt || 0)
            .input('invoice_receipt', sql.NVarChar, orderData.invoice_receipt || '')
            .query(`INSERT INTO Orders (userId, orderId, paymentId, payment_status, delivery_name, delivery_email, delivery_phone, delivery_address_line, subTotalAmt, totalAmt, invoice_receipt)
                    VALUES (@userId, @orderId, @paymentId, @payment_status, @delivery_name, @delivery_email, @delivery_phone, @delivery_address_line, @subTotalAmt, @totalAmt, @invoice_receipt);
                    SELECT SCOPE_IDENTITY() as id;`);
        return result.recordset[0].id;
    } catch (err) {
        console.error("Error creating order:", err);
        throw err;
    }
}

// Function to get orders by userId
export async function getOrdersByUserId(userId) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM Orders WHERE userId = @userId');
        return result.recordset;
    } catch (err) {
        console.error("Error getting orders by user ID:", err);
        throw err;
    }
}

// Function to get an order by ID
export async function getOrderById(id) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('id', sql.Int, id)
            .query('SELECT * FROM Orders WHERE id = @id');
        return result.recordset[0];
    } catch (err) {
        console.error("Error getting order by ID:", err);
        throw err;
    }
}
// Function to count all orders
export async function countOrders() {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request.query('SELECT COUNT(*) AS count FROM Orders');
        return result.recordset[0].count;
    } catch (err) {
        console.error("Error counting orders:", err);
        throw err;
    }
}
