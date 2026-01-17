
const Employee = require("../Module/employeeModule");
const User = require("../Module/userModule")
const bcrypt = require('bcrypt');
const multer = require('multer')
const department = require('../Module/depMoule')

const fs = require('fs');
const path = require('path');

const uploadPath = path.join(__dirname, 'public', 'uploads');

// Folder check and create
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploads = multer({ storage: storage });


const addEmployee = async (req, res) => {
    try {
        const { name, email, dateofbirth,joiningDate, gender, materialStatus, designation, department, salary, password, role } = req.body;

        // 🔢 Employee ID generation
        const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });

        let newEmployeeId = "540001";

        if (lastEmployee && lastEmployee.employeeId) {
            const lastId = parseInt(lastEmployee.employeeId);

            newEmployeeId = lastId >= 540001
                ? (lastId + 1).toString()
                : "540001";
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User is already registered" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
            profileImage: req.file ? req.file.filename : ""
        });
        const savedUser = await newUser.save();

        const newEmployee = new Employee({
            userID: savedUser._id,
            employeeId: newEmployeeId,
            dateofbirth,
            joiningDate,
            gender,
            materialStatus,
            designation,
            department,
            salary,
        });
        await newEmployee.save();

        return res.status(200).json({ success: true, message: "Employee added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Failed to add Employee" });
    }
};


const getEmployee = async (req, res) => {
    try {
        const employes = await Employee.find().populate("userID").populate('department')
        return res.status(200).json({ success: true, employes })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to get employees" });
    }
}

//data get for edit department
const getOneEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        
        let employee = await Employee.findById({ _id: id })
            .populate("userID", { password: 0 })
            .populate("department");

        if (!employee) {
            employee = await Employee.findOne({ userID: id })
                .populate("userID", { password: 0 })
                .populate("department");
        }

        if (!employee) return res.status(404).json({ success: false, error: "Employee not found" });

        return res.status(200).json({ success: true, employee });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to get Employee" });
    }
};
const updateEmployee = async (req, res) => {
    try {
        const { name, materialStatus, designation, department, salary, role } = req.body;
        const { id } = req.params

        const employee = await Employee.findById({ _id: id })
        if (!employee) {
            return res.status(500).json({ success: false, error: "Employee Not Found" });
        }

        const userEmp = await User.findById({ _id: employee.userID })
        if (!userEmp) {
            return res.status(500).json({ success: false, error: "User Not Found" });
        }


        const updaetUser = await User.findByIdAndUpdate({ _id: employee.userID }, { name, role })

        const updateEmplo = await Employee.findByIdAndUpdate({ _id: id }, { designation, materialStatus, salary, department })

        if (!updaetUser || !updateEmplo) {
            return res.status(500).json({ success: false, error: "documnet not found" });
        }

        return res.status(200).json({ success: true, message: "Update Succcefully" })

    } catch (error) {

        return res.status(500).json({ success: false, error: "Failed to update Employee" });
    }
}

const fetechEmployeeDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.find({ department: id }).populate("userID", "name")
        return res.status(200).json({ success: true, employee })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to get Employee" });
    }
}



/* ================= BLOCK / UNBLOCK EMPLOYEE ================= */
const toggleBlockEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const user = await User.findById(employee.userID);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? "Employee blocked" : "Employee unblocked",
      isBlocked: user.isBlocked
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update status" });
  }
};
module.exports = { addEmployee, uploads, getEmployee, getOneEmployee, updateEmployee, fetechEmployeeDepartment,toggleBlockEmployee }