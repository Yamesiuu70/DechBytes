import { sql, connectMssqlDB } from '../config/db.js';

export async function countReports() {
    const pool = await connectMssqlDB();
    const result = await pool.request()
        .query('SELECT COUNT(*) AS count FROM Reports');
    return result.recordset[0].count;
}

export async function createReport(reportData) {
    const pool = await connectMssqlDB();
    const result = await pool.request()
        .input('userId', sql.Int, reportData.userId)
        .input('opinion', sql.NVarChar(sql.MAX), reportData.opinion)
        .query(`
            INSERT INTO Reports (userId, opinion, createdAt, updatedAt)
            VALUES (@userId, @opinion, GETDATE(), GETDATE());
            SELECT SCOPE_IDENTITY() AS id;
        `);
    return { id: result.recordset[0].id, ...reportData };
}

export async function findAllReportsWithUser() {
    const pool = await connectMssqlDB();
    const result = await pool.request()
        .query(`
            SELECT R.id, R.opinion, R.createdAt, R.updatedAt,
                   U.name AS userName, U.email AS userEmail, U.id AS userId
            FROM Reports R
            JOIN Users U ON R.userId = U.id
        `);
    return result.recordset;
}
