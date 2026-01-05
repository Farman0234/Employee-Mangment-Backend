const SalaryModule = require("../Module/SalaryModule")
const Employee = require("../Module/employeeModule")


const addSalary = async (req, res) => {
    try {
        const { employeeId, month, basicSalary, Allowance = 0, Deductation = 0, payDate } = req.body

        const exists = await SalaryModule.findOne({ employeeId, month })
        if (exists) {
            return res.status(400).json({
                success: false,
                error: "Salary already generated for this month"
            })
        }

        const totalSalary = Number(basicSalary) + Number(Allowance) - Number(Deductation)

        const newSalary = await SalaryModule({
            employeeId,
            month,
            basicSalary,
            Allowance,
            Deductation,
            netSalary: totalSalary,
            payDate
        })
        await newSalary.save()
        return res.status(200).json({ success: true, message: "Salary Add Sucessfully" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to get Employee" });
    }
}

const getoneSalary = async (req, res) => {
    try {
        const { id } = req.params;
        let salary
        salary = await SalaryModule.find({ employeeId: id }).populate("employeeId", "employeeId").sort({ createdAt: -1 })
        
        if (!salary || salary.length < 1) {

            const employee = await Employee.findOne({ userID: id })
            salary = await SalaryModule.find({ employeeId: employee._id }).populate("employeeId", "employeeId")
        }
        return res.status(200).json({ success: true, salary })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch salary" });
    }
}

module.exports = { addSalary, getoneSalary }