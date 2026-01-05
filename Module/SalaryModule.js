const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    month: {
        type: String, // "2025-01"
        required: true
    },
    basicSalary: { type: Number, required: true, },
    Allowance: { type: Number,  default: 0 },
    Deductation: { type: Number,  default: 0 },
    netSalary: { type: Number ,  default: 0},
    payDate: { type: Date, required: true },
    createAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Salary', SalarySchema);