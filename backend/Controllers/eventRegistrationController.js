const EventRegistration = require("../Models/eventRegistrationModel");
const notificationController = require("./notificationController");

exports.registerForEvent = async (req, res) => {
    try {
        const registration = new EventRegistration(req.body);
        const savedRegistration = await registration.save();

        // Notify Admins
        await notificationController.createNotification(
            'admin',
            `New event RSVP from ${req.body.studentName} for the event: ${req.body.eventName}.`,
            'event_registration',
            savedRegistration._id
        );

        res.status(201).json(savedRegistration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminEventRequests = async (req, res) => {
    try {
        const requests = await EventRegistration.find().populate('clubId', 'name image');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyEventRequests = async (req, res) => {
    try {
        const requests = await EventRegistration.find().populate('clubId', 'name image');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEventRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRequest = await EventRegistration.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedRequest) return res.status(404).json({ message: "Registration not found" });

        if (req.body.status && (req.body.status === 'approved' || req.body.status === 'rejected')) {
            await notificationController.createNotification(
                updatedRequest.studentId,
                `Your RSVP for the event '${updatedRequest.eventName}' has been ${req.body.status}.`,
                req.body.status === 'approved' ? 'event_approved' : 'event_rejected',
                updatedRequest._id
            );
        } else if (req.body.status === 'pending') {
            await notificationController.createNotification(
                updatedRequest.studentId,
                `Your RSVP for '${updatedRequest.eventName}' has been rolled back to pending.`,
                'system',
                updatedRequest._id
            );
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEventRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await EventRegistration.findByIdAndDelete(id);
        if (!deletedRequest) return res.status(404).json({ message: "Registration not found" });
        res.status(200).json({ message: "Registration deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
