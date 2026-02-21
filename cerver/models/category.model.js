import { sql, connectMssqlDB } from '../config/db.js';

// Function to create a new category
export async function createCategory(name) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('name', sql.NVarChar, name)
            .query(`INSERT INTO Categories (name)
                    VALUES (@name);
                    SELECT SCOPE_IDENTITY() as id;`);
        return result.recordset[0].id;
    } catch (err) {
        console.error("Error creating category:", err);
        throw err;
    }
}

// Function to get all categories
export async function getAllCategories() {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .query('SELECT * FROM Categories');
        return result.recordset;
    } catch (err) {
        console.error("Error getting all categories:", err);
        throw err;
    }
}

// Function to get a category by ID
export async function getCategoryById(id) {
    try {
        const pool = await connectMssqlDB();
        const request = pool.request();
        const result = await request
            .input('id', sql.Int, id)
            .query('SELECT * FROM Categories WHERE id = @id');
        return result.recordset[0];
    } catch (err) {
        console.error("Error getting category by ID:", err);
        throw err;
    }
}
// Add more functions as needed (e.g., updateCategory, deleteCategory)
