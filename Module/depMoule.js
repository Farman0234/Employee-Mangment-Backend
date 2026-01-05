const mongoose = require('mongoose');
const employeeModule = require('./employeeModule');
const LeaveModule = require('./LeaveModule');
const SalaryModule = require('./SalaryModule');
const userModule = require('./userModule');


const departmentSchema = new mongoose.Schema({
    dep_name: { type: String, required: true },
    description: { type: String },
    createAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

departmentSchema.pre("deleteOne", { document: true, query: false },
    async function () {
        try {
            const employees = await employeeModule.find({ department: this._id });
            const empIds = employees.map(emp => emp._id);

            await employeeModule.deleteMany({ department: this._id });
            await userModule.deleteMany({ employeeId: { $in: empIds } });
            await LeaveModule.deleteMany({ employeeId: { $in: empIds } });
            await SalaryModule.deleteMany({ employeeId: { $in: empIds } });

        } catch (error) {

            throw error;
        }
    }
);

module.exports = mongoose.model('Department', departmentSchema);