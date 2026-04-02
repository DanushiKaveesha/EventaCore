const Membership = require("../Models/membershipModel");


const path = require("path");

// Request Membership
exports.requestMembership = async (req, res) => {
    try {
        const membershipData = { ...req.body };

        if (req.file) {
            membershipData.paymentSlip = path.relative(
                path.join(__dirname, '..'),
                req.file.path
            ).replace(/\\/g, '/');
        }

        const membership = new Membership(membershipData);
        const savedMembership = await membership.save();



        res.status(201).json(savedMembership);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get My Requests (Filtered by User ID)
exports.getMyRequests = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) {
            query.user = userId;
        }
        const requests = await Membership.find(query).populate('clubId', 'name image');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Request
exports.updateRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.status === 'approved') {
            const membership = await Membership.findById(id);
            if (!membership) return res.status(404).json({ message: "Request not found" });
            if (membership.paymentStatus !== 'verified') {
                return res.status(400).json({ message: "Cannot approve membership: Payment is not verified." });
            }
        }

        const updatedRequest = await Membership.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRequest) return res.status(404).json({ message: "Request not found" });



        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Request
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await Membership.findByIdAndDelete(id);
        if (!deletedRequest) return res.status(404).json({ message: "Request not found" });
        res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Memberships (Admin)
exports.getAllMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find().populate('clubId', 'name image').sort({ createdAt: -1 });
        res.status(200).json(memberships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Payment Status (Admin)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;
        const updated = await Membership.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true }
        ).populate('clubId', 'name');
        if (!updated) return res.status(404).json({ message: 'Membership not found' });



        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
