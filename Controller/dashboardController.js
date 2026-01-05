const employeeModule = require("../Module/employeeModule");
const Department = require("../Module/depMoule");
const LeaveModule = require("../Module/LeaveModule");

const getSummary = async (req, res) => {
    try {
        const totalEmployee = await employeeModule.countDocuments();
        const totalDepartment = await Department.countDocuments();

        const totalSalary = await employeeModule.aggregate([
            {
                $group: {
                    _id: null,
                    totalSalary: { $sum: { $toDouble: "$salary" } } 
                }
            }
        ]);

        const employeeAppliedForLeave = await LeaveModule.distinct('employeeId');


        const leaveStatus = await LeaveModule.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const leaveSummary = {
            appliedFor: employeeAppliedForLeave,
            approved: leaveStatus.find(item => item._id === "Approved")?.count || 0,
            rejected: leaveStatus.find(item => item._id === "Rejected")?.count || 0,
            pending: leaveStatus.find(item => item._id === "Pending")?.count || 0,
        };

        return res.status(200).json({
            success: true,
            totalEmployee,
            totalDepartment,
            totalSalary: totalSalary[0]?.totalSalary || 0,
            leaveSummary
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to get summary" });
    }
}

module.exports = { getSummary };