import { countUsers } from "../utils/user.db.js";
import { countProducts } from "../utils/product.db.js";
import { countOrders } from "../utils/order.db.js";
import { countReports } from "../utils/report.db.js";
import { countHelps } from "../utils/help.db.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userCount = await countUsers();
        const productCount = await countProducts();
        const orderCount = await countOrders();
        const reportCount = await countReports();
        const helpCount = await countHelps();

        res.status(200).json({
            userCount,
            productCount,
            orderCount,
            reportCount,
            helpCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
};