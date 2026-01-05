const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    leaveType: {
        type: String,
        enum: ["sick", "casual", "annual", "unpaid"],
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Leaves', LeaveSchema);