const EventRegistration = require("../Models/eventRegistrationModel");



exports.registerForEvent = async (req, res) => {
    try {
        const registration = new EventRegistration(req.body);
        const savedRegistration = await registration.save();



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
        const { userId } = req.query;
        let query = {};
        if (userId) {
            query.user = userId;
        }
        const requests = await EventRegistration.find(query).populate('clubId', 'name image');
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
