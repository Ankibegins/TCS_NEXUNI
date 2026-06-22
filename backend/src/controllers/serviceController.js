const Service = require('../models/Service');

// @desc    Create a new freelance service
// @route   POST /api/services
// @access  Private (Requires Token)
const createService = async (req, res, next) => {
    try {
        const {
            title,
            category,
            subcategory,
            description,
            pricing,
            extras,
            tags,
            thumbnail,
            status
        } = req.body;

        // Create the service and inherently link it to the logged-in user
        const service = await Service.create({
            sellerId: req.user._id, // Gotten dynamically from the JWT middleware
            title,
            category,
            subcategory,
            description,
            pricing,
            extras,
            tags,
            thumbnail,
            status: status || 'Draft'
        });

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
    try {
        const query = {};
        if (req.query.excludeSeller) {
            query.sellerId = { $ne: req.query.excludeSeller };
        }

        // Fetch all services and populate the seller info directly from the User model!
        const services = await Service.find(query)
            .populate('sellerId', 'name avatar stats')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        next(error);
    }
};

const getMyServices = async (req, res, next) => {
    try {
        const services = await Service.find({ sellerId: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        next(error);
    }
};

const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        // Make sure user owns the service
        if (service.sellerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this service' });
        }

        await Service.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

const updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        // Make sure user owns the service
        if (service.sellerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this service' });
        }

        service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createService,
    getServices,
    getMyServices,
    deleteService,
    updateService
};
