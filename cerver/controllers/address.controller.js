import { createAddress, findAddressesByUserId, findAddressById, updateAddressById, deleteAddress } from '../utils/address.db.js';

export async function createAddressController(req, res) {
    try {
        const userId = req.userId; // Assuming userId is available from auth middleware
        const { address_line, city, state, pincode, country, mobile } = req.body;

        if (!address_line || !city || !state || !pincode || !country || !mobile) {
            return res.status(400).json({ message: "All address fields are required", success: false });
        }

        const newAddress = await createAddress({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId
        });

        res.status(201).json({ message: "Address created successfully", success: true, data: newAddress });

    } catch (error) {
        console.error("Error creating address:", error);
        res.status(500).json({ message: "Server error", error: error.message, success: false });
    }
}

export async function getUserAddressesController(req, res) {
    try {
        const userId = req.userId; // Assuming userId is available from auth middleware
        const addresses = await findAddressesByUserId(userId);
        res.status(200).json({ message: "User addresses fetched successfully", success: true, data: addresses });
    } catch (error) {
        console.error("Error fetching user addresses:", error);
        res.status(500).json({ message: "Server error", error: error.message, success: false });
    }
}

export async function updateAddressController(req, res) {
    try {
        const userId = req.userId;
        const addressId = req.params.id;
        const updateData = req.body;

        const existingAddress = await findAddressById(addressId);

        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ message: "Address not found or unauthorized", success: false });
        }

        const updatedAddress = await updateAddressById(addressId, updateData);
        res.status(200).json({ message: "Address updated successfully", success: true, data: updatedAddress });

    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: "Server error", error: error.message, success: false });
    }
}

export async function deleteAddressController(req, res) {
    try {
        const userId = req.userId;
        const addressId = req.params.id;

        const existingAddress = await findAddressById(addressId);

        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ message: "Address not found or unauthorized", success: false });
        }

        await deleteAddress(addressId);
        res.status(200).json({ message: "Address deleted successfully", success: true });

    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Server error", error: error.message, success: false });
    }
}