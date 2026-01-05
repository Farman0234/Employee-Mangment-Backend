const employeeModule = require("../Module/employeeModule");
const LeaveModule = require("../Module/LeaveModule");

// Add leave
const addLeaves = async (req, res) => {
    try {
        const userID = req.user.id;
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // Date validation first
        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({
                success: false,
                error: "End date cannot be before start date"
            });
        }

        const employee = await employeeModule.findOne({ userID });
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: "Employee not found"
            });
        }

        // Initialize leave balance if not exists
        if (!employee.leaveBalance) {
            employee.leaveBalance = {
                sick: 10,
                casual: 10,
                annual: 10,
                unpaid: 0
            };
        }

        const daysRequested = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

        if (employee.leaveBalance[leaveType] === undefined) {
            return res.status(400).json({ success: false, error: "Invalid leave type" });
        }

        if (employee.leaveBalance[leaveType] < daysRequested) {
            return res.status(400).json({
                success: false,
                error: `You only have ${employee.leaveBalance[leaveType]} ${leaveType} leave(s) remaining`
            });
        }

        // Deduct leave
        employee.leaveBalance[leaveType] -= daysRequested;
        await employee.save();

        // Save leave request
        const leave = new LeaveModule({
            employeeId: employee._id,
            leaveType,
            startDate,
            endDate,
            reason
        });
        await leave.save();

        // Send updated leave balance
        return res.status(200).json({
            success: true,
            message: "Leave added successfully",
            leaveBalance: employee.leaveBalance
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to add leave" });
    }
};

// Get leaves

const getLeaves = async (req, res) => {
    try {
        const { id } = req.params
        let leave = await LeaveModule.find({ employeeId: id })

        if (!leave || leave.length === 0) {

            const employee = await employeeModule.findOne({ userID: id });

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    error: "Employee not found"
                });
            }
            leave = await LeaveModule.find({ employeeId: employee._id });

        }
        return res.status(200).json({ success: true, leave });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch leaves" });
    }
};

const getAdminleave = async (req, res) => {

    try {
        const leavs = await LeaveModule.find().populate({
            path: 'employeeId',
            populate: [{
                path: 'department',
                select: 'dep_name'
            },
            {
                path: 'userID',
                select: 'name'
            }
            ]
        }

        )
        return res.status(200).json({ success: true, leavs })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: "Failed to get leaves" });
    }
}

const getLeavesDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const leaves = await LeaveModule.findById({ _id: id }).populate({
            path: 'employeeId',
            populate: [{
                path: 'department',
                select: 'dep_name'
            },
            {
                path: 'userID',
                select: 'profileImage'
            },
            ]
        }

        )
        return res.status(200).json({ success: true, leaves })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to get leaves" });
    }
};


const leaveStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const leaves = await LeaveModule.findByIdAndUpdate({ _id: id }, { status: req.body.status })
        if (!leaves) {
            return res.status(404).json({ success: false, error: "leaves Not Found" });
        }
        return res.status(200).json({ success: true, leaves })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to get leaves" });
    }
}






module.exports = { addLeaves, getLeaves, getAdminleave, getLeavesDetails, leaveStatus };
