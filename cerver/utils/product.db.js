import { sql, connectMssqlDB } from '../config/db.js';

export async function findProductsByCategoryId(categoryId) {
    const pool = await connectMssqlDB();
    const result = await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .query('SELECT * FROM Products WHERE categoryId = @categoryId');
    return result.recordset;
}

export async function findProductByIdAndCategoryId(productId, categoryId) {
    const pool = await connectMssqlDB();
    const result = await pool.request()
        .input('id', sql.Int, productId)
        .input('categoryId', sql.Int, categoryId)
        .query('SELECT * FROM Products WHERE id = @id AND categoryId = @categoryId');
    return result.recordset[0];
}

export async function createProduct(productData) {
    const pool = await connectMssqlDB();
    const result = await pool.request()
        .input('name', sql.NVarChar(255), productData.name)
        .input('price', sql.Decimal(10, 2), productData.price)
        .input('photo', sql.NVarChar(sql.MAX), productData.photo)
        .input('details', sql.NVarChar(sql.MAX), productData.details)
        .input('categoryId', sql.Int, productData.categoryId)
        .query(`
            INSERT INTO Products (name, price, photo, details, categoryId, created_at, updated_at)
            VALUES (@name, @price, @photo, @details, @categoryId, GETDATE(), GETDATE());
            SELECT SCOPE_IDENTITY() AS id;
        `);
    return { id: result.recordset[0].id, ...productData };
}

export async function countProducts() {
    const pool = await connectMssqlDB();
    const result = await pool.request()
        .query('SELECT COUNT(*) AS count FROM Products');
    return result.recordset[0].count;
}

export async function searchProducts(query) {
    const pool = await connectMssqlDB();
    const result = await pool.request()
        .input('query', sql.NVarChar(255), `%${query}%`)
        .query(`
            SELECT P.id, P.name, P.price, P.photo, P.details, C.name AS categoryName
            FROM Products P
            JOIN Categories C ON P.categoryId = C.id
            WHERE P.name LIKE @query COLLATE Latin1_General_CI_AI
        `);
    return result.recordset;
}

// ✅ NEW: Get product by ID only
export async function getProductById(id) {
    const pool = await connectMssqlDB();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT p.id, p.name, p.price, p.photo, p.details, 
                   c.id as categoryId, c.name as categoryName
            FROM Products p
            LEFT JOIN Categories c ON p.categoryId = c.id
            WHERE p.id = @id
        `);
    return result.recordset[0];
}