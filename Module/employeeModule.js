const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    userID: { type: Schema.Types.ObjectId, ref: "EMS", required: true },
    employeeId: { type: String, required: true, unique: true },
    dateofbirth: { type: Date, required: true },
    joiningDate: { type: Date, required: false },
    leaveBalance: {
        sick: { type: Number, default: 10 },
        casual: { type: Number, default: 10 },
        annual: { type: Number, default: 10 },
        unpaid: { type: Number, default: 0 }
    },
        gender: { type: String, required: true },
    materialStatus: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    salary: { type: String, required: true },
    
    createAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Employee', employeeSchema);