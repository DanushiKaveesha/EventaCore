const Membership = require("../Models/membershipModel");
const notificationController = require("./notificationController");
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

        // Notify Admin
        await notificationController.createNotification(
            'admin',
            `New membership request from ${req.body.studentName} for a club.`,
            'membership_request',
            savedMembership._id
        );

        res.status(201).json(savedMembership);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get My Requests (Placeholder identifier)
exports.getMyRequests = async (req, res) => {
    try {
        // In a real app, we'd filter by req.user.id
        // For now, let's assume the frontend sends a studentId or we return all for simplicity
        const requests = await Membership.find().populate('clubId', 'name image');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Request
exports.updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRequest = await Membership.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRequest) return res.status(404).json({ message: "Request not found" });

        // Notify Student if status changed
        if (req.body.status && (req.body.status === 'approved' || req.body.status === 'rejected')) {
            await notificationController.createNotification(
                updatedRequest.studentId, // We use studentId as the userId for now
                `Your membership request for the club has been ${req.body.status}.`,
                req.body.status === 'approved' ? 'membership_approved' : 'membership_rejected',
                updatedRequest._id
            );
        }

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

        // Notify the student
        await notificationController.createNotification(
            updated.studentId,
            `Your payment for ${updated.clubId?.name || 'the club'} has been ${paymentStatus}.`,
            paymentStatus === 'verified' ? 'payment_verified' : 'payment_rejected',
            updated._id
        );

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
